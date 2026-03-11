"""
factory_ai.memory.vector_memory
================================
Tier-2 agent memory: semantic vector store for long-term knowledge retrieval.

Each SkilledDroid maintains a private Chroma collection that persists across
tasks. The droid can:
  - store() — embed and index a task output or fact
  - recall() — retrieve the K most semantically similar memories
  - forget() — prune old / low-value memories

Backends:
  1. Chroma (recommended — local, embedded, no external service)
  2. Weaviate (self-hosted, scales to millions of vectors)
  3. In-memory list (fallback — no persistence, testing only)

Storage layout (Chroma):
  collection name: factory_<droid_name>
  metadata fields: droid, task_id, model, timestamp, tags[]
"""

import os
import time
import logging
from typing import Any

logger = logging.getLogger(__name__)


class VectorMemory:
    """
    Long-term semantic memory for a SkilledDroid.

    Usage:
        mem = VectorMemory(droid_name="LeadHarvester", persist_dir="/var/factory/mem")
        mem.store(task_id="LH_0001", text="PropAI scored 87 on ICP", tags=["lead", "proptech"])
        results = mem.recall("AI proptech startups", top_k=5)
    """

    def __init__(
        self,
        droid_name: str,
        persist_dir: str | None = None,
        backend: str = "auto",
    ):
        self.droid_name = droid_name
        self.persist_dir = persist_dir or os.getenv("FACTORY_MEM_DIR", "/tmp/factory_memory")
        self.backend = backend
        self._collection = None
        self._client = None
        self._memory_list: list[dict] = []   # in-memory fallback
        self._init()

    # ------------------------------------------------------------------
    # Initialization
    # ------------------------------------------------------------------

    def _init(self):
        if self.backend in ("auto", "chroma"):
            try:
                import chromadb  # type: ignore
                os.makedirs(self.persist_dir, exist_ok=True)
                self._client = chromadb.PersistentClient(path=self.persist_dir)
                col_name = f"factory_{self.droid_name.lower().replace(' ', '_')}"
                self._collection = self._client.get_or_create_collection(
                    name=col_name,
                    metadata={"hnsw:space": "cosine"},
                )
                self.backend = "chroma"
                logger.info(
                    f"[VectorMemory:{self.droid_name}] Chroma backend | "
                    f"dir={self.persist_dir} | collection={col_name}"
                )
                return
            except ImportError:
                logger.debug("chromadb not installed — trying Weaviate")
            except Exception as exc:
                logger.warning(f"Chroma init failed ({exc}) — falling back")

        if self.backend in ("auto", "weaviate"):
            try:
                import weaviate  # type: ignore
                url = os.getenv("WEAVIATE_URL", "http://localhost:8080")
                self._client = weaviate.Client(url)
                self.backend = "weaviate"
                logger.info(f"[VectorMemory:{self.droid_name}] Weaviate backend | url={url}")
                return
            except ImportError:
                logger.debug("weaviate-client not installed")

        self.backend = "memory"
        logger.warning(
            f"[VectorMemory:{self.droid_name}] No vector DB — using in-memory list (no persistence)"
        )

    # ------------------------------------------------------------------
    # Core operations
    # ------------------------------------------------------------------

    def store(
        self,
        text: str,
        task_id: str | None = None,
        tags: list[str] | None = None,
        metadata: dict | None = None,
    ) -> str:
        """
        Embed and persist a memory entry.

        Args:
            text:     The content to remember (task output, fact, insight).
            task_id:  Source task identifier for traceability.
            tags:     Categorical labels for filtering.
            metadata: Additional key-value pairs to store alongside the vector.

        Returns:
            The memory ID assigned to this entry.
        """
        mem_id = task_id or f"{self.droid_name}_{int(time.time() * 1000)}"
        meta = {
            "droid":     self.droid_name,
            "task_id":   mem_id,
            "timestamp": time.time(),
            "tags":      ",".join(tags or []),
            **(metadata or {}),
        }

        if self.backend == "chroma":
            self._collection.upsert(
                documents=[text],
                ids=[mem_id],
                metadatas=[meta],
            )
        else:
            self._memory_list.append({"id": mem_id, "text": text, **meta})

        logger.debug(f"[VectorMemory:{self.droid_name}] Stored mem_id={mem_id}")
        return mem_id

    def recall(
        self,
        query: str,
        top_k: int = 5,
        tag_filter: str | None = None,
    ) -> list[dict[str, Any]]:
        """
        Retrieve the top-K semantically similar memories.

        Args:
            query:      Natural-language query to embed and match.
            top_k:      Number of results to return.
            tag_filter: If set, only return memories with this tag.

        Returns:
            List of dicts with keys: id, text, score, metadata.
        """
        logger.debug(f"[VectorMemory:{self.droid_name}] Recall query={query!r} top_k={top_k}")

        if self.backend == "chroma":
            where = {"tags": {"$contains": tag_filter}} if tag_filter else None
            kwargs: dict[str, Any] = {"query_texts": [query], "n_results": min(top_k, max(1, self._collection.count()))}
            if where:
                kwargs["where"] = where
            res = self._collection.query(**kwargs)
            results = []
            for i, doc in enumerate(res.get("documents", [[]])[0]):
                results.append({
                    "id":       res["ids"][0][i],
                    "text":     doc,
                    "score":    round(1 - res["distances"][0][i], 4),
                    "metadata": res["metadatas"][0][i] if res.get("metadatas") else {},
                })
            return results

        # In-memory fallback: simple keyword overlap scoring
        scored = []
        query_words = set(query.lower().split())
        for entry in self._memory_list:
            if tag_filter and tag_filter not in entry.get("tags", ""):
                continue
            text_words = set(entry["text"].lower().split())
            overlap = len(query_words & text_words) / max(len(query_words), 1)
            scored.append({
                "id":       entry["id"],
                "text":     entry["text"],
                "score":    round(overlap, 4),
                "metadata": {k: v for k, v in entry.items() if k not in ("id", "text")},
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    def forget(self, mem_ids: list[str]) -> int:
        """Delete specific memory entries by ID. Returns number deleted."""
        if self.backend == "chroma":
            self._collection.delete(ids=mem_ids)
            return len(mem_ids)
        before = len(self._memory_list)
        self._memory_list = [e for e in self._memory_list if e["id"] not in mem_ids]
        return before - len(self._memory_list)

    def prune_oldest(self, keep: int = 1000) -> int:
        """Keep only the `keep` most recent memories. Returns number pruned."""
        if self.backend == "chroma":
            count = self._collection.count()
            if count <= keep:
                return 0
            all_ids = self._collection.get(include=[])["ids"]
            to_delete = all_ids[: count - keep]
            self._collection.delete(ids=to_delete)
            return len(to_delete)
        before = len(self._memory_list)
        self._memory_list = sorted(
            self._memory_list, key=lambda x: x.get("timestamp", 0), reverse=True
        )[:keep]
        return before - len(self._memory_list)

    def count(self) -> int:
        """Return total number of stored memories."""
        if self.backend == "chroma":
            return self._collection.count()
        return len(self._memory_list)

    def get_stats(self) -> dict[str, Any]:
        return {
            "droid":       self.droid_name,
            "backend":     self.backend,
            "count":       self.count(),
            "persist_dir": self.persist_dir,
        }
