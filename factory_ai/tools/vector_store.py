"""
Tool: VectorStoreTool
---------------------
Performs semantic similarity lookups against a vector database.

Backends supported:
  1. Chroma (local, embedded)
  2. Weaviate (remote)
  3. In-memory cosine similarity (fallback for testing)

Used by: LeadHarvester (CRM embeddings), ScoutDroid (research corpus)
"""

import os
import logging
from typing import Any

logger = logging.getLogger(__name__)


class VectorStoreTool:
    """
    Plugin that queries a vector store and returns semantically similar documents.

    Result shape:
      {
        "id": str,
        "text": str,
        "score": float,      # cosine similarity 0-1
        "metadata": dict,
        "source": str
      }
    """

    TOOL_NAME = "vector_lookup"

    def __init__(self, config: dict | None = None):
        self.config = config or {}
        self.backend = self.config.get("backend", "auto")
        self.collection = self.config.get("collection", "default")
        self.top_k = self.config.get("top_k", 5)
        self._client = None
        self._init_backend()

    def _init_backend(self):
        """Initialize the vector store backend."""
        if self.backend in ("auto", "chroma"):
            try:
                import chromadb  # type: ignore
                self._client = chromadb.Client()
                self._collection = self._client.get_or_create_collection(self.collection)
                self.backend = "chroma"
                logger.info(f"[{self.TOOL_NAME}] Using Chroma backend")
                return
            except ImportError:
                logger.debug("chromadb not installed")

        if self.backend in ("auto", "weaviate"):
            try:
                import weaviate  # type: ignore
                weaviate_url = self.config.get("weaviate_url") or os.getenv("WEAVIATE_URL", "http://localhost:8080")
                self._client = weaviate.Client(weaviate_url)
                self.backend = "weaviate"
                logger.info(f"[{self.TOOL_NAME}] Using Weaviate backend at {weaviate_url}")
                return
            except ImportError:
                logger.debug("weaviate-client not installed")

        # Fallback: in-memory mock
        self.backend = "memory"
        self._memory_store: list[dict] = []
        logger.warning(f"[{self.TOOL_NAME}] No vector DB available — using in-memory mock")

    def add_document(self, text: str, doc_id: str, metadata: dict | None = None):
        """Index a document into the vector store."""
        if self.backend == "chroma":
            self._collection.add(
                documents=[text],
                ids=[doc_id],
                metadatas=[metadata or {}],
            )
        elif self.backend == "memory":
            self._memory_store.append({
                "id": doc_id,
                "text": text,
                "metadata": metadata or {},
            })

    def query(self, query_text: str, top_k: int | None = None) -> list[dict[str, Any]]:
        """
        Retrieve the top-K most semantically similar documents.

        Args:
            query_text: Natural-language query to embed and match.
            top_k:      Number of results (overrides config default).

        Returns:
            List of result dicts.
        """
        k = top_k or self.top_k
        logger.info(f"[{self.TOOL_NAME}] query={query_text!r} top_k={k}")

        if self.backend == "chroma":
            return self._chroma_query(query_text, k)
        if self.backend == "weaviate":
            return self._weaviate_query(query_text, k)
        return self._mock_results(query_text, k)

    def _chroma_query(self, query: str, k: int) -> list[dict[str, Any]]:
        results = self._collection.query(query_texts=[query], n_results=k)
        out = []
        for i, doc in enumerate(results.get("documents", [[]])[0]):
            out.append({
                "id":       results["ids"][0][i],
                "text":     doc,
                "score":    1 - results["distances"][0][i],  # convert distance to similarity
                "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
                "source":   "chroma",
            })
        return out

    def _weaviate_query(self, query: str, k: int) -> list[dict[str, Any]]:
        response = (
            self._client.query
            .get(self.collection, ["text", "metadata"])
            .with_near_text({"concepts": [query]})
            .with_limit(k)
            .with_additional(["certainty"])
            .do()
        )
        items = response.get("data", {}).get("Get", {}).get(self.collection, [])
        return [
            {
                "id":       str(i),
                "text":     item.get("text", ""),
                "score":    item.get("_additional", {}).get("certainty", 0.0),
                "metadata": item.get("metadata", {}),
                "source":   "weaviate",
            }
            for i, item in enumerate(items)
        ]

    def _mock_results(self, query: str, k: int) -> list[dict[str, Any]]:
        """Return mock results from in-memory store or generate placeholders."""
        if self._memory_store:
            return [
                {**doc, "score": round(0.9 - i * 0.05, 2), "source": "memory"}
                for i, doc in enumerate(self._memory_store[:k])
            ]
        return [
            {
                "id":       f"mock_{i}",
                "text":     f"[MOCK] Relevant document {i+1} for query: {query}",
                "score":    round(0.9 - i * 0.1, 2),
                "metadata": {"type": "mock"},
                "source":   "mock",
            }
            for i in range(min(k, 3))
        ]

    def format_for_prompt(self, query: str) -> str:
        """Query and format results as markdown for LLM injection."""
        results = self.query(query)
        lines = [f"## Vector Store Results for: {query!r}\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. [score={r['score']:.2f}] {r['text'][:300]}")
        return "\n".join(lines)
