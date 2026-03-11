"""
factory_ai.cluster.node_setup
==============================
Multi-device Ray cluster bootstrap helpers.

Handles node-specific setup for each device in the swarm:
  - Samsung Galaxy S25 Ultra (Termux / Ubuntu on Android)
  - Linux CPU worker (laptop/desktop)
  - Linux GPU worker (CUDA / ROCm)
  - Cloud spot instance (Lambda Labs / RunPod / Vast.ai)

Usage:
  # On S25 Ultra / head node:
  python -m factory_ai.cluster.node_setup --role head

  # On each worker:
  python -m factory_ai.cluster.node_setup --role worker --head-ip 192.168.1.10

  # Print setup instructions for a role without running:
  python -m factory_ai.cluster.node_setup --role gpu --dry-run
"""

import os
import sys
import subprocess
import platform
import argparse
import logging

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Node profiles
# ---------------------------------------------------------------------------

NODE_PROFILES = {
    "head": {
        "description": "Samsung Galaxy S25 Ultra — Ray Head Node + control plane",
        "ray_cmd":     lambda ip: ["ray", "start", "--head",
                                   "--dashboard-host=0.0.0.0",
                                   "--port=6379",
                                   "--ray-client-server-port=10001"],
        "ollama_models": ["llama3", "mistral"],
        "use_gpu":     False,
        "min_ram_gb":  8,
        "notes": [
            "Install Termux from F-Droid (not Play Store — no sandbox restrictions)",
            "Run: pkg install python clang git",
            "Run: pip install ray[default] PyYAML",
            "Ensure port 6379, 8265, and 10001 are accessible on your LAN",
        ],
    },
    "cpu": {
        "description": "CPU Worker — laptop or desktop (no GPU required)",
        "ray_cmd":     lambda ip: ["ray", "start", f"--address={ip}:6379"],
        "ollama_models": ["qwen2.5", "mistral", "llama3"],
        "use_gpu":     False,
        "min_ram_gb":  8,
        "notes": [
            "Run after the head node is up",
            "Ensure bidirectional LAN connectivity to head node on port 6379",
        ],
    },
    "gpu": {
        "description": "GPU Worker — CUDA-enabled machine for deep inference",
        "ray_cmd":     lambda ip: ["ray", "start", f"--address={ip}:6379",
                                   "--num-gpus=1"],
        "ollama_models": ["deepseek-coder", "qwen2.5", "llama3", "mistral"],
        "use_gpu":     True,
        "min_ram_gb":  16,
        "notes": [
            "Requires NVIDIA CUDA ≥12.0 or AMD ROCm ≥6.0",
            "Set OLLAMA_GPU=1 before starting the worker",
            "GPU is automatically visible to Ray once --num-gpus is set",
            "Recommended: RTX 3090, A10G, or better for deepseek-coder",
        ],
    },
    "cloud": {
        "description": "Cloud Spot Worker — autoscale burst node",
        "ray_cmd":     lambda ip: ["ray", "start", f"--address={ip}:6379",
                                   "--num-gpus=1",
                                   "--autoscaling-config=/etc/ray/autoscaler.yaml"],
        "ollama_models": ["llama3", "qwen2.5"],
        "use_gpu":     True,
        "min_ram_gb":  16,
        "notes": [
            "Provision via Lambda Labs, RunPod, or Vast.ai",
            "Use spot/interruptible instances to minimize cost",
            "Pre-install Ollama and pull models in a base Docker image",
            "Set RAY_DISABLE_IMPORT_WARNING=1 to suppress warnings on Termux",
        ],
    },
}


# ---------------------------------------------------------------------------
# Setup helpers
# ---------------------------------------------------------------------------

def check_prerequisites(role: str) -> list[str]:
    """Return a list of unmet prerequisite warnings for the given role."""
    issues = []
    profile = NODE_PROFILES[role]

    # Python version
    if sys.version_info < (3, 10):
        issues.append(f"Python ≥3.10 required (found {sys.version})")

    # RAM
    try:
        import psutil  # type: ignore
        ram_gb = psutil.virtual_memory().total / 1e9
        if ram_gb < profile["min_ram_gb"]:
            issues.append(
                f"Low RAM: {ram_gb:.1f}GB available, {profile['min_ram_gb']}GB recommended"
            )
    except ImportError:
        pass

    # Ray
    try:
        import ray  # type: ignore
    except ImportError:
        issues.append("Ray not installed — run: pip install ray[default]")

    # Ollama
    result = subprocess.run(["which", "ollama"], capture_output=True)
    if result.returncode != 0:
        issues.append("Ollama not found — install from https://ollama.com/install.sh")

    # CUDA (GPU roles only)
    if profile["use_gpu"]:
        result = subprocess.run(["nvidia-smi"], capture_output=True)
        if result.returncode != 0:
            issues.append("nvidia-smi not found — CUDA driver may not be installed")

    return issues


def pull_ollama_models(models: list[str], dry_run: bool = False) -> None:
    """Pull required Ollama models for this node role."""
    for model in models:
        print(f"  Pulling Ollama model: {model}")
        if not dry_run:
            subprocess.run(["ollama", "pull", model], check=False)


def start_ray_node(role: str, head_ip: str = "127.0.0.1", dry_run: bool = False) -> None:
    """Start Ray as head or worker based on the node role."""
    profile = NODE_PROFILES[role]
    cmd = profile["ray_cmd"](head_ip)
    env = os.environ.copy()

    if profile["use_gpu"]:
        env["OLLAMA_GPU"] = "1"

    print(f"\nStarting Ray ({role} mode): {' '.join(cmd)}")
    if not dry_run:
        subprocess.run(cmd, env=env, check=False)


def print_setup_guide(role: str, head_ip: str = "HEAD_IP") -> None:
    """Print human-readable setup instructions for a node role."""
    profile = NODE_PROFILES[role]
    models = " ".join(profile["ollama_models"])

    print(f"\n{'='*65}")
    print(f"Factory.ai Node Setup: {role.upper()}")
    print(f"{profile['description']}")
    print(f"{'='*65}")

    print("\n### Prerequisites")
    for note in profile["notes"]:
        print(f"  • {note}")

    print("\n### Install dependencies")
    print("  pip install ray[default] PyYAML")
    if role in ("gpu", "cloud"):
        print("  pip install ray[default] PyYAML chromadb duckdb redis")

    print("\n### Install & configure Ollama")
    print("  curl -fsSL https://ollama.com/install.sh | sh")
    print(f"  ollama pull {models}")

    print("\n### Start Ray node")
    cmd = profile["ray_cmd"](head_ip)
    if role == "head":
        print("  # On head node:")
    else:
        print(f"  # On {role} worker (replace HEAD_IP with actual IP):")
    print(f"  {' '.join(cmd)}")

    if role == "head":
        print("\n### Verify cluster")
        print("  ray status")
        print("  open http://localhost:8265  # Ray dashboard")

    print("\n### Connect from S25 Ultra")
    print("  import ray")
    print(f"  ray.init('ray://{head_ip}:10001')")
    print("  from factory_ai import DroidFactory")
    print("  factory = DroidFactory()")
    print(f"{'='*65}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Factory.ai node setup utility")
    parser.add_argument("--role", choices=list(NODE_PROFILES), required=True)
    parser.add_argument("--head-ip", default="127.0.0.1",
                        help="Head node IP (required for worker/gpu/cloud roles)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print commands without executing them")
    parser.add_argument("--guide", action="store_true",
                        help="Print setup guide and exit")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    if args.guide:
        print_setup_guide(args.role, args.head_ip)
        return

    profile = NODE_PROFILES[args.role]
    print(f"\nFactory.ai Node Setup — {args.role.upper()}")
    print(f"{profile['description']}\n")

    # Prerequisites check
    issues = check_prerequisites(args.role)
    if issues:
        print("Prerequisite issues:")
        for issue in issues:
            print(f"  ! {issue}")
        if not args.dry_run:
            print("\nResolve issues above before continuing.")
            return
    else:
        print("All prerequisites met.")

    # Pull models
    print(f"\nPulling Ollama models: {profile['ollama_models']}")
    pull_ollama_models(profile["ollama_models"], dry_run=args.dry_run)

    # Start Ray
    start_ray_node(args.role, head_ip=args.head_ip, dry_run=args.dry_run)

    if args.role == "head":
        print("\nHead node started.")
        print(f"  Ray Dashboard: http://localhost:8265")
        print(f"  Client port:   ray://localhost:10001")
        print(f"  Worker connect: ray start --address=<this-ip>:6379")


if __name__ == "__main__":
    main()
