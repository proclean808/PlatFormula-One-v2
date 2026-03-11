"""
factory_ai.router.router_droid
================================
RouterDroid — Intelligent task dispatcher Ray actor.

The RouterDroid sits above the SkilledDroid layer as the entry point
for all incoming tasks. It:
  1. Classifies the task via KeywordRouter (or embedding fallback)
  2. Selects the best available droid from the live registry
  3. Dispatches the task to that droid via ray.get()
  4. Returns the result with routing metadata attached

Topology:

  External caller / S25 Ultra
        │
        ▼
  RouterDroid   ←── KeywordRouter (classification)
        │
        ├──▶ CodeDroid     (deepseek-coder)
        ├──▶ TradeDroid    (qwen2.5)
        ├──▶ LeadHarvester (mistral)
        └──▶ ScoutDroid    (llama3)

Circuit breaker:
  If the preferred droid is busy or unavailable, RouterDroid falls back
  to the next best match in the same category, then to the default droid.
"""

import ray
import time
import logging
from typing import Any

from .routing_rules import KeywordRouter, RouteDecision

logger = logging.getLogger(__name__)


@ray.remote
class RouterDroid:
    """
    Intelligent task router Ray actor.

    Maintains a live registry of droid handles, classifies incoming tasks,
    and dispatches them to the best available worker.

    Usage:
        router = RouterDroid.remote()
        router.register.remote("LeadHarvester", lead_droid_handle)
        result = ray.get(router.dispatch.remote("Find AI proptech startups"))
    """

    def __init__(self, strategy: str = "keyword"):
        """
        Args:
            strategy: Routing strategy — "keyword" (default) or "embedding".
        """
        self._registry: dict[str, Any] = {}          # name → Ray actor handle
        self._model_map: dict[str, str] = {}          # name → model string
        self._router = KeywordRouter()
        self._strategy = strategy
        self._dispatch_log: list[dict] = []
        self._dispatch_count = 0
        logger.info(f"[RouterDroid] Online | strategy={strategy}")

    # ------------------------------------------------------------------
    # Registry management
    # ------------------------------------------------------------------

    def register(self, name: str, handle: Any, model: str = "unknown") -> None:
        """Register a SkilledDroid handle with the router."""
        self._registry[name] = handle
        self._model_map[name] = model
        logger.info(f"[RouterDroid] Registered droid: {name} (model={model})")

    def unregister(self, name: str) -> bool:
        """Remove a droid from the routing registry."""
        if name in self._registry:
            del self._registry[name]
            self._model_map.pop(name, None)
            logger.info(f"[RouterDroid] Unregistered: {name}")
            return True
        return False

    def list_registered(self) -> list[dict[str, str]]:
        return [{"name": n, "model": self._model_map.get(n, "?")} for n in self._registry]

    # ------------------------------------------------------------------
    # Routing
    # ------------------------------------------------------------------

    def classify(self, prompt: str) -> dict[str, Any]:
        """Classify a prompt and return routing decision (no dispatch)."""
        decision = self._router.route(prompt)
        return {
            "droid":      decision.droid,
            "model":      decision.model,
            "category":   decision.category,
            "confidence": decision.confidence,
            "rationale":  decision.rationale,
            "fallback":   decision.fallback,
        }

    def explain(self, prompt: str) -> dict[str, Any]:
        """Return full scoring breakdown for all routing rules."""
        return self._router.explain(prompt)

    def dispatch(self, prompt: str, timeout: int = 120) -> dict[str, Any]:
        """
        Classify and dispatch a task to the best available droid.

        Returns the droid's result dict augmented with routing metadata.
        Circuit-breaker: if preferred droid is unavailable, falls back to
        the next registered droid in the same category, then to any droid.
        """
        self._dispatch_count += 1
        start = time.monotonic()

        decision = self._router.route(prompt)
        target_name = self._select_droid(decision)

        if target_name is None:
            return {
                "task_id":  f"router_{self._dispatch_count:04d}",
                "error":    "No droids registered. Spawn droids via DroidFactory first.",
                "routing":  {"droid": decision.droid, "category": decision.category},
                "elapsed_ms": 0,
            }

        droid_handle = self._registry[target_name]
        logger.info(
            f"[RouterDroid] Dispatching #{self._dispatch_count} → {target_name} "
            f"(category={decision.category}, confidence={decision.confidence:.2f})"
        )

        result = ray.get(droid_handle.run_task.remote(prompt, timeout))
        elapsed_ms = int((time.monotonic() - start) * 1000)

        result["routing"] = {
            "strategy":   self._strategy,
            "category":   decision.category,
            "confidence": decision.confidence,
            "rationale":  decision.rationale,
            "fallback":   decision.fallback,
            "router_ms":  elapsed_ms - result.get("elapsed_ms", 0),
        }

        # Log dispatch record
        log_entry = {
            "dispatch_id": self._dispatch_count,
            "prompt":      prompt[:200],
            "target":      target_name,
            "category":    decision.category,
            "elapsed_ms":  elapsed_ms,
            "timestamp":   time.time(),
        }
        if len(self._dispatch_log) >= 100:
            self._dispatch_log.pop(0)
        self._dispatch_log.append(log_entry)

        return result

    def dispatch_many(self, prompts: list[str], timeout: int = 120) -> list[dict[str, Any]]:
        """
        Fan-out: classify and dispatch multiple prompts in parallel.

        All tasks are issued concurrently via Ray futures; results collected
        in order once all complete.
        """
        futures = [self.dispatch.remote(p, timeout) for p in prompts]
        return ray.get(futures)

    # ------------------------------------------------------------------
    # Circuit breaker / droid selection
    # ------------------------------------------------------------------

    def _select_droid(self, decision: RouteDecision) -> str | None:
        """
        Choose the best available droid handle given a routing decision.

        Priority:
          1. Exact name match from decision (e.g. "CodeDroid")
          2. Any registered droid matching the same model family
          3. Any registered droid (last-resort fallback)
        """
        if not self._registry:
            return None

        # 1. Exact name
        if decision.droid in self._registry:
            return decision.droid

        # 2. Same model family (e.g. "deepseek" prefix)
        model_prefix = decision.model.split("-")[0].lower()
        for name, model in self._model_map.items():
            if model_prefix in model.lower():
                logger.debug(f"[RouterDroid] Exact droid not found; using {name} (model={model})")
                return name

        # 3. Any available droid
        fallback = next(iter(self._registry))
        logger.warning(f"[RouterDroid] Falling back to {fallback}")
        return fallback

    # ------------------------------------------------------------------
    # Introspection
    # ------------------------------------------------------------------

    def get_status(self) -> dict[str, Any]:
        return {
            "name":            "RouterDroid",
            "strategy":        self._strategy,
            "registered":      len(self._registry),
            "dispatch_count":  self._dispatch_count,
            "droids":          self.list_registered(),
        }

    def get_dispatch_log(self, last_n: int = 20) -> list[dict]:
        return self._dispatch_log[-last_n:]

    def ping(self) -> str:
        return "pong from RouterDroid"
