"""
Factory.ai Skilled Droid Actor
------------------------------
Each SkilledDroid is a Ray remote actor that binds to an Ollama model
and executes tasks autonomously using a configurable tool stack.

Topology:
  Ray Head Node (Factory Controller)
    └── SkilledDroid (Ray Actor)
          ├── Ollama Model runtime
          └── Tool Plugin registry
"""

import ray
import subprocess
import json
import time
import logging
from typing import Any

logger = logging.getLogger(__name__)


@ray.remote
class SkilledDroid:
    """
    A Ray Actor representing a single skilled droid unit.

    Each droid wraps:
      - An Ollama model (local inference runtime)
      - A named skill identity
      - An optional set of tool plugin names
      - Short-term task history (in-memory ring buffer)
    """

    def __init__(
        self,
        name: str,
        model: str,
        tools: list[str] | None = None,
        ollama_host: str = "http://localhost:11434",
        max_history: int = 20,
    ):
        self.name = name
        self.model = model
        self.tools = tools or []
        self.ollama_host = ollama_host
        self._history: list[dict] = []
        self._max_history = max_history
        self._task_count = 0
        logger.info(f"[{self.name}] Droid online | model={self.model} | tools={self.tools}")

    # ------------------------------------------------------------------
    # Core task execution
    # ------------------------------------------------------------------

    def run_task(self, prompt: str, timeout: int = 120) -> dict[str, Any]:
        """
        Dispatch a prompt to the Ollama runtime and return structured output.

        Args:
            prompt: Natural-language instruction for the droid.
            timeout: Max seconds to wait for the model response.

        Returns:
            dict with keys: droid, model, prompt, output, elapsed_ms, task_id
        """
        self._task_count += 1
        task_id = f"{self.name}_{self._task_count:04d}"
        start = time.monotonic()

        try:
            result = subprocess.run(
                ["ollama", "run", self.model, prompt],
                capture_output=True,
                text=True,
                timeout=timeout,
                env={"OLLAMA_HOST": self.ollama_host, "PATH": "/usr/local/bin:/usr/bin:/bin"},
            )
            output = result.stdout.strip()
            error = result.stderr.strip() if result.returncode != 0 else None
        except subprocess.TimeoutExpired:
            output = ""
            error = f"Task timed out after {timeout}s"
        except FileNotFoundError:
            output = ""
            error = "Ollama binary not found. Ensure Ollama is installed and on PATH."

        elapsed_ms = int((time.monotonic() - start) * 1000)

        record = {
            "task_id": task_id,
            "droid": self.name,
            "model": self.model,
            "prompt": prompt,
            "output": output,
            "error": error,
            "elapsed_ms": elapsed_ms,
            "tools_available": self.tools,
        }

        # Ring-buffer history
        if len(self._history) >= self._max_history:
            self._history.pop(0)
        self._history.append(record)

        return record

    def run_task_with_tools(self, prompt: str, tool_results: dict[str, str] | None = None) -> dict[str, Any]:
        """
        Run a task where tool outputs are injected into the prompt context.

        Constructs a ReAct-style prompt:
          [System context with tool results] + [User prompt]
        """
        if tool_results:
            context_lines = ["## Tool Context\n"]
            for tool, result in tool_results.items():
                context_lines.append(f"### {tool}\n{result}\n")
            augmented_prompt = "\n".join(context_lines) + f"\n## Task\n{prompt}"
        else:
            augmented_prompt = prompt

        return self.run_task(augmented_prompt)

    # ------------------------------------------------------------------
    # Introspection
    # ------------------------------------------------------------------

    def get_status(self) -> dict[str, Any]:
        """Return droid health/status metadata."""
        return {
            "name": self.name,
            "model": self.model,
            "tools": self.tools,
            "task_count": self._task_count,
            "history_size": len(self._history),
            "ollama_host": self.ollama_host,
            "status": "online",
        }

    def get_history(self, last_n: int = 5) -> list[dict]:
        """Return the last N task records."""
        return self._history[-last_n:]

    def get_name(self) -> str:
        return self.name

    def get_model(self) -> str:
        return self.model

    def ping(self) -> str:
        return f"pong from {self.name}"
