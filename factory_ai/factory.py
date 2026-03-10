"""
Factory.ai Droid Factory
------------------------
DroidFactory compiles Skill Manifests (YAML) into live Ray Actors (SkilledDroids).

Lifecycle:
  1. Load skill YAML
  2. Validate manifest schema
  3. Spawn Ray Actor via SkilledDroid.remote(...)
  4. Register droid in internal registry
  5. Return handle for task dispatch

Topology:
  DroidFactory (controller)
    └── Ray Cluster (auto or manual address)
          └── SkilledDroid actors (one per skill / per scale unit)
"""

import ray
import yaml
import logging
from pathlib import Path
from typing import Any

from .droid_actor import SkilledDroid

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Schema constants
# ---------------------------------------------------------------------------

REQUIRED_FIELDS = {"name", "model"}
OPTIONAL_FIELDS = {
    "description": "",
    "tools": [],
    "memory": {},
    "ollama_host": "http://localhost:11434",
}


class SkillManifest:
    """Parsed, validated representation of a skill YAML file."""

    def __init__(self, data: dict):
        missing = REQUIRED_FIELDS - data.keys()
        if missing:
            raise ValueError(f"Skill manifest missing required fields: {missing}")

        self.name: str = data["name"]
        self.model: str = data["model"]
        self.description: str = data.get("description", "")
        self.tools: list[str] = data.get("tools", [])
        self.memory: dict = data.get("memory", {})
        self.ollama_host: str = data.get("ollama_host", "http://localhost:11434")

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "model": self.model,
            "description": self.description,
            "tools": self.tools,
            "memory": self.memory,
            "ollama_host": self.ollama_host,
        }

    def __repr__(self) -> str:
        return f"<SkillManifest name={self.name!r} model={self.model!r} tools={self.tools}>"


class DroidFactory:
    """
    Factory that compiles skill manifests into distributed Ray actors.

    Usage:
        factory = DroidFactory()
        droid = factory.create_droid("skills/lead_harvester.yaml")
        result = ray.get(droid.run_task.remote("Find AI proptech startups"))
    """

    def __init__(self, ray_address: str = "auto", ignore_reinit: bool = True):
        """
        Initialize Ray connection.

        Args:
            ray_address: Ray cluster address ("auto" uses environment default).
            ignore_reinit: Allow calling ray.init() even if already initialized.
        """
        if not ray.is_initialized():
            try:
                ray.init(address=ray_address, ignore_reinit_error=ignore_reinit)
                logger.info(f"Ray initialized | address={ray_address}")
            except ConnectionError:
                # Fall back to local mode when no cluster is available
                logger.warning("Ray cluster not found — falling back to local mode")
                ray.init(ignore_reinit_error=ignore_reinit)

        self._registry: dict[str, Any] = {}  # name -> Ray actor handle
        self._manifests: dict[str, SkillManifest] = {}
        logger.info("DroidFactory ready")

    # ------------------------------------------------------------------
    # Manifest loading
    # ------------------------------------------------------------------

    def load_manifest(self, skill_file: str | Path) -> SkillManifest:
        """Parse and validate a skill YAML manifest."""
        path = Path(skill_file)
        if not path.exists():
            raise FileNotFoundError(f"Skill file not found: {path}")

        with path.open() as f:
            data = yaml.safe_load(f)

        manifest = SkillManifest(data)
        logger.info(f"Loaded manifest: {manifest}")
        return manifest

    # ------------------------------------------------------------------
    # Droid creation
    # ------------------------------------------------------------------

    def create_droid(
        self,
        skill_file: str | Path,
        num_cpus: float = 0.5,
        num_gpus: float = 0.0,
    ) -> Any:
        """
        Spawn a SkilledDroid Ray actor from a skill manifest.

        Args:
            skill_file: Path to the YAML skill manifest.
            num_cpus:   CPU fraction allocated to this actor.
            num_gpus:   GPU fraction (0.0 = CPU-only droid).

        Returns:
            Ray actor handle (SkilledDroid remote object).
        """
        manifest = self.load_manifest(skill_file)

        # Build resource-constrained remote class
        ActorClass = SkilledDroid.options(
            name=manifest.name,
            num_cpus=num_cpus,
            num_gpus=num_gpus,
            get_if_exists=True,  # reuse if already registered
        )

        droid = ActorClass.remote(
            name=manifest.name,
            model=manifest.model,
            tools=manifest.tools,
            ollama_host=manifest.ollama_host,
        )

        self._registry[manifest.name] = droid
        self._manifests[manifest.name] = manifest
        logger.info(f"Droid spawned: {manifest.name} (model={manifest.model})")
        return droid

    def create_droid_from_spec(
        self,
        name: str,
        model: str,
        tools: list[str] | None = None,
        ollama_host: str = "http://localhost:11434",
        num_cpus: float = 0.5,
    ) -> Any:
        """
        Spawn a droid directly from parameters (no YAML file required).

        Useful for programmatic / API-driven droid creation.
        """
        ActorClass = SkilledDroid.options(
            name=name,
            num_cpus=num_cpus,
            get_if_exists=True,
        )
        droid = ActorClass.remote(
            name=name,
            model=model,
            tools=tools or [],
            ollama_host=ollama_host,
        )
        self._registry[name] = droid
        logger.info(f"Droid spawned from spec: {name} (model={model})")
        return droid

    # ------------------------------------------------------------------
    # Scale operations
    # ------------------------------------------------------------------

    def create_swarm(
        self,
        skill_file: str | Path,
        count: int = 5,
        num_cpus: float = 0.25,
    ) -> list[Any]:
        """
        Spawn N identical droids from a single skill manifest.

        Each droid gets a unique name: <manifest.name>_N
        Droids are distributed across available Ray workers automatically.
        """
        manifest = self.load_manifest(skill_file)
        swarm = []

        for i in range(count):
            droid_name = f"{manifest.name}_{i:02d}"
            ActorClass = SkilledDroid.options(
                name=droid_name,
                num_cpus=num_cpus,
                get_if_exists=True,
            )
            droid = ActorClass.remote(
                name=droid_name,
                model=manifest.model,
                tools=manifest.tools,
                ollama_host=manifest.ollama_host,
            )
            self._registry[droid_name] = droid
            swarm.append(droid)

        logger.info(f"Swarm launched: {count}x {manifest.name} (model={manifest.model})")
        return swarm

    # ------------------------------------------------------------------
    # Registry operations
    # ------------------------------------------------------------------

    def get_droid(self, name: str) -> Any | None:
        """Retrieve a droid handle by name."""
        return self._registry.get(name)

    def list_droids(self) -> list[str]:
        """Return names of all active droids in the registry."""
        return list(self._registry.keys())

    def get_all_statuses(self) -> list[dict]:
        """Fetch status from every registered droid (parallel Ray calls)."""
        handles = list(self._registry.values())
        if not handles:
            return []
        futures = [d.get_status.remote() for d in handles]
        return ray.get(futures)

    def kill_droid(self, name: str) -> bool:
        """Remove and kill a droid actor."""
        droid = self._registry.pop(name, None)
        if droid:
            ray.kill(droid)
            self._manifests.pop(name, None)
            logger.info(f"Droid killed: {name}")
            return True
        return False

    def shutdown(self):
        """Kill all droids and shut down Ray."""
        for name in list(self._registry.keys()):
            self.kill_droid(name)
        ray.shutdown()
        logger.info("DroidFactory shutdown complete")
