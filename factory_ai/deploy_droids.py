"""
Factory.ai Droid Deployment Script
------------------------------------
Demonstrates the full creation lifecycle:
  1. Initialize DroidFactory (connects to Ray cluster)
  2. Create individual droids from skill YAML manifests
  3. Dispatch tasks and collect results
  4. Scale via swarm creation (20+ agents in parallel)

Samsung S25 Ultra (control node) workflow:
  - Run this script from Termux after `ray.init("ray://SERVER_IP:10001")`
  - Or point RAY_ADDRESS env var at the head node
"""

import os
import ray
import logging
from pathlib import Path

from factory_ai import DroidFactory

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

SKILLS_DIR = Path(__file__).parent / "skills"


def demo_single_droids(factory: DroidFactory):
    """Create one droid per skill manifest and dispatch a sample task."""
    skill_files = list(SKILLS_DIR.glob("*.yaml"))
    if not skill_files:
        logger.warning("No skill YAML files found in skills/")
        return

    droids = {}
    for sf in skill_files:
        try:
            droid = factory.create_droid(sf)
            droids[sf.stem] = droid
        except Exception as exc:
            logger.error(f"Failed to create droid from {sf.name}: {exc}")

    # Dispatch tasks in parallel
    task_map = {
        "lead_harvester": "Find the top 5 AI startups in property technology (proptech)",
        "scout_droid":    "Summarize the current state of large language model research in 3 bullet points",
        "trade_droid":    "Identify 3 key financial signals for AI infrastructure stocks this quarter",
        "code_droid":     "Write a Python function that retries an HTTP request with exponential backoff",
    }

    futures = {}
    for name, droid in droids.items():
        prompt = task_map.get(name, f"Hello from {name}. Describe your role in one sentence.")
        futures[name] = droid.run_task.remote(prompt)

    logger.info("Tasks dispatched — waiting for results...")
    for name, future in futures.items():
        result = ray.get(future)
        print(f"\n{'='*60}")
        print(f"DROID : {result['droid']}")
        print(f"MODEL : {result['model']}")
        print(f"TIME  : {result['elapsed_ms']}ms")
        print(f"OUTPUT:\n{result['output'][:500]}{'...' if len(result.get('output','')) > 500 else ''}")
        if result.get("error"):
            print(f"ERROR : {result['error']}")


def demo_swarm(factory: DroidFactory, count: int = 20):
    """
    Launch a swarm of LeadHarvester droids and fan-out a research task.

    This demonstrates Ray's automatic load distribution across workers.
    """
    skill_file = SKILLS_DIR / "lead_harvester.yaml"
    if not skill_file.exists():
        logger.warning(f"Skill file not found: {skill_file}")
        return

    logger.info(f"Spawning swarm of {count} LeadHarvester droids...")
    swarm = factory.create_swarm(skill_file, count=count, num_cpus=0.1)

    prompts = [
        f"Find AI startups in vertical #{i}: "
        + ["fintech", "healthtech", "proptech", "edtech", "legaltech",
           "agritech", "cleantech", "govtech", "hrtech", "retailtech",
           "insurtech", "regtech", "mediatech", "autotech", "biotech",
           "spacetech", "sectech", "logtech", "adtech", "climatetech"][i % 20]
        for i in range(count)
    ]

    futures = [droid.run_task.remote(prompt) for droid, prompt in zip(swarm, prompts)]
    logger.info(f"Swarm tasks dispatched ({count} concurrent). Collecting results...")

    results = ray.get(futures)
    for r in results:
        print(f"[{r['droid']}] {r['elapsed_ms']}ms → {r['output'][:120]}...")

    logger.info(f"Swarm complete. {count} droids executed in parallel.")


def print_cluster_status(factory: DroidFactory):
    """Display registered droids and their statuses."""
    droids = factory.list_droids()
    if not droids:
        print("No droids in registry.")
        return

    print(f"\n{'='*60}")
    print(f"FACTORY REGISTRY — {len(droids)} droids")
    print(f"{'='*60}")

    statuses = factory.get_all_statuses()
    for s in statuses:
        tools_str = ", ".join(s["tools"]) if s["tools"] else "none"
        print(f"  {s['name']:<25} model={s['model']:<15} tasks={s['task_count']}  tools=[{tools_str}]")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Factory.ai Droid Deployment")
    parser.add_argument("--mode", choices=["single", "swarm", "status"], default="single")
    parser.add_argument("--count", type=int, default=20, help="Swarm droid count")
    parser.add_argument("--ray-address", default=os.getenv("RAY_ADDRESS", "auto"),
                        help="Ray cluster address (e.g. ray://192.168.1.10:10001)")
    args = parser.parse_args()

    factory = DroidFactory(ray_address=args.ray_address)

    if args.mode == "single":
        demo_single_droids(factory)
    elif args.mode == "swarm":
        demo_swarm(factory, count=args.count)
    elif args.mode == "status":
        print_cluster_status(factory)

    factory.shutdown()
