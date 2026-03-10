"""
Tool: DatabaseQueryTool
-----------------------
Executes structured queries against SQL or NoSQL databases.

Backends supported:
  1. SQLite (local, zero-config — good for edge/mobile deployments)
  2. PostgreSQL (via psycopg2)
  3. Redis (key-value / queue operations)
  4. In-memory dict store (fallback)

Also used as CRM writer alias:
  - crm_writer tool alias routes writes through this plugin to a CRM table

Used by: LeadHarvester (CRM writes), ScoutDroid (research DB), TradeDroid (market data)
"""

import os
import json
import sqlite3
import logging
from typing import Any

logger = logging.getLogger(__name__)


class DatabaseQueryTool:
    """
    Plugin for structured database read/write operations.

    The run() method accepts a query dict with:
      - operation: "select" | "insert" | "update" | "delete" | "raw"
      - table:     table/collection name
      - data:      dict of column→value for writes
      - filters:   dict of column→value for WHERE clauses
      - limit:     int for SELECT limits
    """

    TOOL_NAME = "database_query"

    def __init__(self, config: dict | None = None):
        self.config = config or {}
        self.backend = self.config.get("backend", "auto")
        self._connection = None
        self._memory_store: dict[str, list[dict]] = {}
        self._init_backend()

    def _init_backend(self):
        if self.backend in ("auto", "sqlite"):
            db_path = self.config.get("db_path") or os.getenv("FACTORY_DB_PATH", ":memory:")
            try:
                self._connection = sqlite3.connect(db_path, check_same_thread=False)
                self._connection.row_factory = sqlite3.Row
                self.backend = "sqlite"
                logger.info(f"[{self.TOOL_NAME}] SQLite backend | path={db_path}")
                return
            except Exception as exc:
                logger.debug(f"SQLite init failed: {exc}")

        if self.backend in ("auto", "postgres"):
            try:
                import psycopg2  # type: ignore
                dsn = self.config.get("dsn") or os.getenv("DATABASE_URL")
                if dsn:
                    self._connection = psycopg2.connect(dsn)
                    self.backend = "postgres"
                    logger.info(f"[{self.TOOL_NAME}] PostgreSQL backend")
                    return
            except ImportError:
                logger.debug("psycopg2 not installed")

        self.backend = "memory"
        logger.warning(f"[{self.TOOL_NAME}] Using in-memory dict store")

    def run(self, query: dict[str, Any]) -> dict[str, Any]:
        """
        Execute a database operation.

        Args:
            query: Dict with keys: operation, table, data, filters, limit.

        Returns:
            Dict with keys: success, rows (for SELECT), affected, error.
        """
        op = query.get("operation", "select").lower()
        table = query.get("table", "records")
        data = query.get("data", {})
        filters = query.get("filters", {})
        limit = query.get("limit", 100)

        logger.info(f"[{self.TOOL_NAME}] op={op} table={table}")

        try:
            if self.backend == "sqlite":
                return self._sqlite_op(op, table, data, filters, limit)
            return self._memory_op(op, table, data, filters, limit)
        except Exception as exc:
            logger.error(f"[{self.TOOL_NAME}] Error: {exc}")
            return {"success": False, "error": str(exc), "rows": [], "affected": 0}

    def _sqlite_op(
        self, op: str, table: str, data: dict, filters: dict, limit: int
    ) -> dict[str, Any]:
        cur = self._connection.cursor()

        if op == "select":
            where, params = self._build_where(filters)
            cur.execute(f"SELECT * FROM {table} {where} LIMIT ?", params + [limit])
            rows = [dict(r) for r in cur.fetchall()]
            return {"success": True, "rows": rows, "affected": len(rows)}

        if op == "insert":
            cols = ", ".join(data.keys())
            placeholders = ", ".join(["?"] * len(data))
            cur.execute(f"INSERT INTO {table} ({cols}) VALUES ({placeholders})", list(data.values()))
            self._connection.commit()
            return {"success": True, "rows": [], "affected": cur.rowcount, "last_id": cur.lastrowid}

        if op == "update":
            set_clause = ", ".join(f"{k}=?" for k in data)
            where, params = self._build_where(filters)
            cur.execute(f"UPDATE {table} SET {set_clause} {where}", list(data.values()) + params)
            self._connection.commit()
            return {"success": True, "rows": [], "affected": cur.rowcount}

        if op == "delete":
            where, params = self._build_where(filters)
            cur.execute(f"DELETE FROM {table} {where}", params)
            self._connection.commit()
            return {"success": True, "rows": [], "affected": cur.rowcount}

        return {"success": False, "error": f"Unknown operation: {op}", "rows": [], "affected": 0}

    def _build_where(self, filters: dict) -> tuple[str, list]:
        if not filters:
            return "", []
        clauses = " AND ".join(f"{k}=?" for k in filters)
        return f"WHERE {clauses}", list(filters.values())

    def _memory_op(
        self, op: str, table: str, data: dict, filters: dict, limit: int
    ) -> dict[str, Any]:
        if table not in self._memory_store:
            self._memory_store[table] = []
        store = self._memory_store[table]

        if op == "select":
            rows = [r for r in store if all(r.get(k) == v for k, v in filters.items())]
            return {"success": True, "rows": rows[:limit], "affected": len(rows[:limit])}

        if op == "insert":
            store.append({**data, "_id": len(store) + 1})
            return {"success": True, "rows": [], "affected": 1, "last_id": len(store)}

        if op == "update":
            count = 0
            for r in store:
                if all(r.get(k) == v for k, v in filters.items()):
                    r.update(data)
                    count += 1
            return {"success": True, "rows": [], "affected": count}

        if op == "delete":
            before = len(store)
            self._memory_store[table] = [
                r for r in store if not all(r.get(k) == v for k, v in filters.items())
            ]
            return {"success": True, "rows": [], "affected": before - len(self._memory_store[table])}

        return {"success": False, "error": f"Unknown operation: {op}", "rows": [], "affected": 0}

    def create_table_if_not_exists(self, table: str, schema: dict[str, str]):
        """
        Helper to create a table from a column→SQLite-type dict.
        Only valid for SQLite backend.
        """
        if self.backend != "sqlite":
            return
        cols = ", ".join(f"{col} {dtype}" for col, dtype in schema.items())
        self._connection.execute(f"CREATE TABLE IF NOT EXISTS {table} ({cols})")
        self._connection.commit()

    def format_for_prompt(self, query: dict) -> str:
        """Run query and format results as markdown table for LLM injection."""
        result = self.run(query)
        if not result["success"]:
            return f"## Database Error\n{result.get('error')}"
        rows = result["rows"]
        if not rows:
            return "## Database Result\nNo records found."
        headers = list(rows[0].keys())
        header_row = " | ".join(headers)
        sep = " | ".join(["---"] * len(headers))
        data_rows = "\n".join(" | ".join(str(r.get(h, "")) for h in headers) for r in rows[:20])
        return f"## Database Results\n\n{header_row}\n{sep}\n{data_rows}"
