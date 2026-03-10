"""
Factory.ai Tool Plugin Layer
----------------------------
Tools are loaded dynamically by the Droid runtime based on the
`tools` list in each skill manifest.

Available plugins:
  web_search      — DuckDuckGo / SerpAPI web search
  vector_store    — Chroma / Weaviate vector similarity lookup
  database_query  — SQL / NoSQL query interface
  api_router      — Generic HTTP API call router

Usage in a droid task (ReAct-style):
  Prompt → LLM decides which tool → tool executes → result back to LLM
"""

from .web_search import WebSearchTool
from .vector_store import VectorStoreTool
from .database_query import DatabaseQueryTool
from .api_router import APIRouterTool

TOOL_REGISTRY: dict[str, type] = {
    "web_search":     WebSearchTool,
    "vector_lookup":  VectorStoreTool,
    "vector_store":   VectorStoreTool,
    "database_query": DatabaseQueryTool,
    "crm_writer":     DatabaseQueryTool,   # alias — writes to CRM DB
    "api_router":     APIRouterTool,
}


def load_tool(name: str, config: dict | None = None):
    """Instantiate a tool plugin by name."""
    cls = TOOL_REGISTRY.get(name)
    if cls is None:
        raise ValueError(f"Unknown tool: {name!r}. Available: {list(TOOL_REGISTRY)}")
    return cls(config or {})


__all__ = [
    "WebSearchTool",
    "VectorStoreTool",
    "DatabaseQueryTool",
    "APIRouterTool",
    "TOOL_REGISTRY",
    "load_tool",
]
