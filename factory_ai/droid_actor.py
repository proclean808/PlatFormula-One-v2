"""
Factory.ai Skilled Droid Actor  (v2 — upgraded)
-------------------------------------------------
Each SkilledDroid is a Ray remote actor that binds to an Ollama model
and executes tasks autonomously using a configurable tool stack.

Upgrades in v2:
  • GPU-aware Ray actor options (OLLAMA_GPU env + num_gpus parameter)
  • Tier-2 memory: optional Chroma vector memory (VectorMemory)
  • Tier-3 memory: optional DuckDB episodic task log (EpisodicLog)
  • Agent-to-agent messaging: publish / consume via MessageBus
  • get_status() now reports memory stats and GPU flag

Topology:
  Ray Head Node (Factory Controller)
    └── SkilledDroid (Ray Actor)
          ├── Ollama Model runtime  (subprocess or GPU-accelerated)
          ├── Tool Plugin registry
          ├── VectorMemory          (Chroma — long-term knowledge)
          ├── EpisodicLog           (DuckDB — structured task history)
          └── MessageBus connection (Redis Streams — droid to droid)
"""

import ray
import subprocess
import time
import logging
import os
from typing import Any

logger = logging.getLogger(__name__)


@ray.remote
class SkilledDroid:
    """
    A Ray Actor representing a single skilled droid unit.

    Memory tiers:
      1. _history ring buffer   — in-actor, always available
      2. VectorMemory (Chroma)  — optional, attach via enable_memory()
      3. EpisodicLog  (DuckDB)  — optional, attach via enable_memory()

    Messaging:
      Attach a MessageBus via enable_messaging() to let droids
      publish results to each other without going through the factory.
    """

    def __init__(
        self,
        name: str,
        model: str,
        tools: list[str] | None = None,
        ollama_host: str = "http://localhost:11434",
        max_history: int = 20,
        use_gpu: bool = False,
        memory_dir: str | None = None,
    ):
        self.name = name
        self.model = model
        self.tools = tools or []
        self.ollama_host = ollama_host
        self.use_gpu = use_gpu
        self._history: list[dict] = []
        self._max_history = max_history
        self._task_count = 0

        # Memory layers (initialized lazily via enable_memory)
        self._vector_mem = None
        self._episodic_log = None
        self._memory_dir = memory_dir or os.getenv("FACTORY_MEM_DIR", "/tmp/factory_memory")
        self._memory_enabled = False

        # Messaging layer (initialized lazily via enable_messaging)
        self._bus = None
        self._messaging_enabled = False

        if use_gpu:
            os.environ["OLLAMA_GPU"] = "1"

        logger.info(
            f"[{self.name}] Droid v2 online | model={self.model} | "
            f"tools={self.tools} | gpu={use_gpu}"
        )

    # ------------------------------------------------------------------
    # Memory layer setup
    # ------------------------------------------------------------------

    def enable_memory(
        self,
        vector_backend: str = "auto",
        log_backend: str = "auto",
    ) -> dict[str, str]:
        """
        Attach Tier-2 (Chroma) and Tier-3 (DuckDB) memory layers.
        Safe to call after the actor is running. Returns backend status dict.
        """
        try:
            from factory_ai.memory.vector_memory import VectorMemory
            self._vector_mem = VectorMemory(
                droid_name=self.name,
                persist_dir=self._memory_dir,
                backend=vector_backend,
            )
        except Exception as exc:
            logger.warning(f"[{self.name}] VectorMemory init failed: {exc}")
            self._vector_mem = None

        try:
            from factory_ai.memory.episodic_log import EpisodicLog
            self._episodic_log = EpisodicLog(
                droid_name=self.name,
                backend=log_backend,
            )
        except Exception as exc:
            logger.warning(f"[{self.name}] EpisodicLog init failed: {exc}")
            self._episodic_log = None

        self._memory_enabled = (
            self._vector_mem is not None or self._episodic_log is not None
        )
        return {
            "vector_memory": self._vector_mem.backend if self._vector_mem else "disabled",
            "episodic_log":  self._episodic_log.backend if self._episodic_log else "disabled",
        }

    # ------------------------------------------------------------------
    # Messaging layer setup
    # ------------------------------------------------------------------

    def enable_messaging(self, redis_url: str | None = None) -> str:
        """
        Attach a Redis Streams message bus for droid-to-droid comms.
        Safe to call after the actor is running. Returns backend name.
        """
        try:
            from factory_ai.messaging.message_bus import MessageBus
            self._bus = MessageBus(redis_url=redis_url)
            self._messaging_enabled = True
            logger.info(f"[{self.name}] Messaging enabled | backend={self._bus.backend}")
            return self._bus.backend
        except Exception as exc:
            logger.warning(f"[{self.name}] Messaging init failed: {exc}")
            return "disabled"

    # ------------------------------------------------------------------
    # Core task execution
    # ------------------------------------------------------------------

    def run_task(self, prompt: str, timeout: int = 120) -> dict[str, Any]:
        """
        Dispatch a prompt to Ollama and return structured output.

        Automatically writes to VectorMemory and EpisodicLog if enabled.
        """
        self._task_count += 1
        task_id = f"{self.name}_{self._task_count:04d}"
        start = time.monotonic()

        # Optionally augment prompt with recalled memories
        effective_prompt = self._recall_augment(prompt) if self._vector_mem else prompt

        try:
            env = {
                **os.environ,
                "OLLAMA_HOST": self.ollama_host,
                "PATH": "/usr/local/bin:/usr/bin:/bin",
            }
            if self.use_gpu:
                env["OLLAMA_GPU"] = "1"

            proc = subprocess.run(
                ["ollama", "run", self.model, effective_prompt],
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env,
            )
            output = proc.stdout.strip()
            error = proc.stderr.strip() if proc.returncode != 0 else None
        except subprocess.TimeoutExpired:
            output = ""
            error = f"Task timed out after {timeout}s"
        except FileNotFoundError:
            output = ""
            error = "Ollama binary not found. Ensure Ollama is installed and on PATH."

        elapsed_ms = int((time.monotonic() - start) * 1000)

        record = {
            "task_id":         task_id,
            "droid":           self.name,
            "model":           self.model,
            "prompt":          prompt,
            "output":          output,
            "error":           error,
            "elapsed_ms":      elapsed_ms,
            "tools_available": self.tools,
            "gpu":             self.use_gpu,
        }

        # Tier-1: ring buffer
        if len(self._history) >= self._max_history:
            self._history.pop(0)
        self._history.append(record)

        # Tier-2: vector memory
        if self._vector_mem and output:
            try:
                self._vector_mem.store(
                    text=output,
                    task_id=task_id,
                    tags=[self.model, self.name],
                )
            except Exception as exc:
                logger.debug(f"[{self.name}] VectorMemory store error: {exc}")

        # Tier-3: episodic log
        if self._episodic_log:
            try:
                self._episodic_log.record(
                    task_id=task_id,
                    model=self.model,
                    prompt=prompt,
                    output=output,
                    elapsed_ms=elapsed_ms,
                    error=error,
                )
            except Exception as exc:
                logger.debug(f"[{self.name}] EpisodicLog record error: {exc}")

        return record

    def run_task_with_tools(
        self,
        prompt: str,
        tool_results: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """Run a task with pre-fetched tool outputs injected as context (ReAct pattern)."""
        if tool_results:
            ctx = ["## Tool Context\n"]
            for tool, result in tool_results.items():
                ctx.append(f"### {tool}\n{result}\n")
            augmented = "\n".join(ctx) + f"\n## Task\n{prompt}"
        else:
            augmented = prompt
        return self.run_task(augmented)

    # ------------------------------------------------------------------
    # Memory helpers
    # ------------------------------------------------------------------

    def _recall_augment(self, prompt: str, top_k: int = 3) -> str:
        """Prepend relevant past memories to the prompt for context."""
        if not self._vector_mem:
            return prompt
        try:
            memories = self._vector_mem.recall(prompt, top_k=top_k)
            if not memories:
                return prompt
            lines = ["## Relevant Past Knowledge\n"]
            for m in memories:
                lines.append(f"- [score={m['score']:.2f}] {m['text'][:200]}")
            return "\n".join(lines) + f"\n\n## Current Task\n{prompt}"
        except Exception:
            return prompt

    def recall(self, query: str, top_k: int = 5) -> list[dict]:
        """Query vector memory directly and return similar past outputs."""
        if not self._vector_mem:
            return []
        return self._vector_mem.recall(query, top_k=top_k)

    def get_episodic_stats(self) -> dict[str, Any]:
        """Return aggregated episodic performance stats from DuckDB."""
        if not self._episodic_log:
            return {"error": "episodic log not enabled — call enable_memory() first"}
        return self._episodic_log.aggregate()

    # ------------------------------------------------------------------
    # Messaging helpers
    # ------------------------------------------------------------------

    def publish_to(
        self,
        to_droid: str,
        payload: Any,
        msg_type: str = "data",
    ) -> str | None:
        """Send a message to another droid via the message bus."""
        if not self._bus:
            logger.warning(f"[{self.name}] Messaging not enabled — call enable_messaging() first")
            return None
        return self._bus.publish(
            from_droid=self.name,
            to_droid=to_droid,
            payload=payload,
            msg_type=msg_type,
        )

    def broadcast(self, payload: Any, msg_type: str = "signal") -> str | None:
        """Broadcast a factory-wide message to all droids."""
        if not self._bus:
            return None
        return self._bus.broadcast(from_droid=self.name, payload=payload, msg_type=msg_type)

    def read_inbox(self, count: int = 10) -> list[dict]:
        """Read pending messages from this droid's inbox."""
        if not self._bus:
            return []
        return self._bus.consume(droid_name=self.name, count=count)

    def get_queue_depth(self) -> dict[str, int]:
        """Return inbox/outbox/broadcast message counts."""
        if not self._bus:
            return {"inbox": 0, "outbox": 0, "broadcast": 0}
        return self._bus.queue_depth(self.name)

    # ------------------------------------------------------------------
    # Introspection
    # ------------------------------------------------------------------

    def get_status(self) -> dict[str, Any]:
        """Return comprehensive droid health and capability metadata."""
        status: dict[str, Any] = {
            "name":              self.name,
            "model":             self.model,
            "tools":             self.tools,
            "task_count":        self._task_count,
            "history_size":      len(self._history),
            "ollama_host":       self.ollama_host,
            "gpu":               self.use_gpu,
            "memory_enabled":    self._memory_enabled,
            "messaging_enabled": self._messaging_enabled,
            "status":            "online",
        }
        if self._vector_mem:
            status["vector_memory"] = self._vector_mem.get_stats()
        if self._episodic_log:
            status["episodic_log"] = self._episodic_log.get_stats()
        if self._bus:
            status["message_bus"] = self._bus.get_stats()
        return status

    def get_history(self, last_n: int = 5) -> list[dict]:
        return self._history[-last_n:]

    def get_name(self) -> str:
        return self.name

    def get_model(self) -> str:
        return self.model

    def ping(self) -> str:
        return f"pong from {self.name} (gpu={self.use_gpu})"
