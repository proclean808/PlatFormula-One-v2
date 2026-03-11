"""
factory_ai.memory.episodic_log
================================
Tier-3 agent memory: structured episodic task log backed by DuckDB.

Every completed task is written as a row in a durable fact store.
This enables:
  - Time-series analytics on droid performance
  - Exact replay of any historical task
  - Cross-droid aggregation queries (e.g. average latency per model)
  - Export to Parquet / CSV for downstream analysis

Schema:
  task_id     TEXT PRIMARY KEY
  droid       TEXT
  model       TEXT
  prompt      TEXT
  output      TEXT
  elapsed_ms  INTEGER
  error       TEXT
  tags        TEXT    -- comma-separated
  created_at  DOUBLE  -- unix timestamp

Backends:
  1. DuckDB  (recommended — in-process OLAP, no daemon required)
  2. SQLite  (fallback — less analytics capability but zero-dependency)
  3. In-memory list (offline testing)
"""

import os
import time
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)

_CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS episodes (
    task_id    TEXT PRIMARY KEY,
    droid      TEXT NOT NULL,
    model      TEXT NOT NULL,
    prompt     TEXT,
    output     TEXT,
    elapsed_ms INTEGER DEFAULT 0,
    error      TEXT,
    tags       TEXT DEFAULT '',
    created_at DOUBLE DEFAULT 0
)
"""

_INSERT = """
INSERT OR REPLACE INTO episodes
    (task_id, droid, model, prompt, output, elapsed_ms, error, tags, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
"""


class EpisodicLog:
    """
    Structured fact store for completed droid task episodes.

    Usage:
        log = EpisodicLog(droid_name="TradeDroid")
        log.record(task_id="TD_0012", model="qwen2.5", prompt="...", output="...", elapsed_ms=340)
        recent = log.query(last_n=10)
        stats  = log.aggregate()
    """

    def __init__(
        self,
        droid_name: str,
        db_path: str | None = None,
        backend: str = "auto",
    ):
        self.droid_name = droid_name
        self.backend = backend
        self._db_path = db_path or os.getenv(
            "FACTORY_DB_PATH",
            f"/tmp/factory_episodes_{droid_name.lower()}.db"
        )
        self._conn = None
        self._episodes: list[dict] = []   # in-memory fallback
        self._init()

    # ------------------------------------------------------------------
    # Initialization
    # ------------------------------------------------------------------

    def _init(self):
        if self.backend in ("auto", "duckdb"):
            try:
                import duckdb  # type: ignore
                self._conn = duckdb.connect(self._db_path)
                self._conn.execute(_CREATE_TABLE)
                self.backend = "duckdb"
                logger.info(f"[EpisodicLog:{self.droid_name}] DuckDB | path={self._db_path}")
                return
            except ImportError:
                logger.debug("duckdb not installed — trying SQLite")

        if self.backend in ("auto", "sqlite"):
            try:
                import sqlite3
                self._conn = sqlite3.connect(self._db_path, check_same_thread=False)
                self._conn.execute(_CREATE_TABLE.replace("OR REPLACE", "OR IGNORE"))
                self._conn.commit()
                self.backend = "sqlite"
                logger.info(f"[EpisodicLog:{self.droid_name}] SQLite | path={self._db_path}")
                return
            except Exception as exc:
                logger.warning(f"SQLite init failed: {exc}")

        self.backend = "memory"
        logger.warning(f"[EpisodicLog:{self.droid_name}] In-memory fallback (no persistence)")

    # ------------------------------------------------------------------
    # Write
    # ------------------------------------------------------------------

    def record(
        self,
        task_id: str,
        model: str,
        prompt: str,
        output: str,
        elapsed_ms: int = 0,
        error: str | None = None,
        tags: list[str] | None = None,
    ) -> None:
        """Persist a completed task episode."""
        entry = (
            task_id,
            self.droid_name,
            model,
            prompt[:4000],          # truncate very long prompts
            output[:8000],          # truncate very long outputs
            elapsed_ms,
            error or "",
            ",".join(tags or []),
            time.time(),
        )

        if self.backend in ("duckdb", "sqlite"):
            self._conn.execute(_INSERT, entry)
            if self.backend == "sqlite":
                self._conn.commit()
        else:
            self._episodes.append({
                "task_id":    task_id,
                "droid":      self.droid_name,
                "model":      model,
                "prompt":     prompt[:4000],
                "output":     output[:8000],
                "elapsed_ms": elapsed_ms,
                "error":      error or "",
                "tags":       ",".join(tags or []),
                "created_at": time.time(),
            })

        logger.debug(f"[EpisodicLog:{self.droid_name}] Recorded {task_id}")

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    def query(
        self,
        last_n: int = 20,
        tag_filter: str | None = None,
        model_filter: str | None = None,
    ) -> list[dict[str, Any]]:
        """Return recent episodes as a list of dicts."""
        if self.backend in ("duckdb", "sqlite"):
            where_clauses = [f"droid = '{self.droid_name}'"]
            if tag_filter:
                where_clauses.append(f"tags LIKE '%{tag_filter}%'")
            if model_filter:
                where_clauses.append(f"model = '{model_filter}'")
            where = " AND ".join(where_clauses)
            sql = f"SELECT * FROM episodes WHERE {where} ORDER BY created_at DESC LIMIT {last_n}"
            rows = self._conn.execute(sql).fetchall()
            cols = ["task_id", "droid", "model", "prompt", "output", "elapsed_ms", "error", "tags", "created_at"]
            return [dict(zip(cols, row)) for row in rows]

        results = list(self._episodes)
        if tag_filter:
            results = [e for e in results if tag_filter in e.get("tags", "")]
        if model_filter:
            results = [e for e in results if e.get("model") == model_filter]
        results.sort(key=lambda x: x.get("created_at", 0), reverse=True)
        return results[:last_n]

    def aggregate(self) -> dict[str, Any]:
        """
        Return performance aggregates for this droid.

        Computes: total tasks, avg/min/max latency, success rate, top models.
        """
        if self.backend in ("duckdb", "sqlite"):
            sql = f"""
                SELECT
                    COUNT(*)                                      AS total_tasks,
                    ROUND(AVG(elapsed_ms), 1)                    AS avg_ms,
                    MIN(elapsed_ms)                               AS min_ms,
                    MAX(elapsed_ms)                               AS max_ms,
                    SUM(CASE WHEN error = '' THEN 1 ELSE 0 END)  AS successes,
                    COUNT(DISTINCT model)                         AS distinct_models
                FROM episodes
                WHERE droid = '{self.droid_name}'
            """
            row = self._conn.execute(sql).fetchone()
            if row:
                total = row[0] or 0
                return {
                    "droid":           self.droid_name,
                    "total_tasks":     total,
                    "avg_ms":          row[1] or 0,
                    "min_ms":          row[2] or 0,
                    "max_ms":          row[3] or 0,
                    "success_rate":    round((row[4] or 0) / max(total, 1) * 100, 1),
                    "distinct_models": row[5] or 0,
                    "backend":         self.backend,
                }

        episodes = self._episodes
        if not episodes:
            return {"droid": self.droid_name, "total_tasks": 0, "backend": "memory"}
        latencies = [e["elapsed_ms"] for e in episodes]
        successes = sum(1 for e in episodes if not e.get("error"))
        return {
            "droid":        self.droid_name,
            "total_tasks":  len(episodes),
            "avg_ms":       round(sum(latencies) / len(latencies), 1),
            "min_ms":       min(latencies),
            "max_ms":       max(latencies),
            "success_rate": round(successes / len(episodes) * 100, 1),
            "backend":      "memory",
        }

    def export_json(self, last_n: int = 100) -> str:
        """Export recent episodes as a JSON string (for dashboard or file export)."""
        return json.dumps(self.query(last_n=last_n), indent=2, default=str)

    def count(self) -> int:
        if self.backend in ("duckdb", "sqlite"):
            return self._conn.execute(
                f"SELECT COUNT(*) FROM episodes WHERE droid = '{self.droid_name}'"
            ).fetchone()[0]
        return len(self._episodes)

    def get_stats(self) -> dict[str, Any]:
        return {
            "droid":    self.droid_name,
            "backend":  self.backend,
            "db_path":  self._db_path,
            "episodes": self.count(),
        }
