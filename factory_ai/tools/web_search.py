"""
Tool: WebSearchTool
-------------------
Performs web searches and returns structured result snippets.

Backends supported (in order of preference):
  1. SerpAPI (requires SERPAPI_KEY env var)
  2. DuckDuckGo HTML scrape (no key required, rate-limited)
  3. Mock fallback (for testing without network access)

Used by: LeadHarvester, ScoutDroid, TradeDroid, CodeDroid
"""

import os
import json
import urllib.parse
import urllib.request
import logging
from typing import Any

logger = logging.getLogger(__name__)


class WebSearchTool:
    """
    Plugin that executes a web search and returns a list of result dicts.

    Result shape:
      {
        "title": str,
        "url": str,
        "snippet": str,
        "source": "serpapi" | "duckduckgo" | "mock"
      }
    """

    TOOL_NAME = "web_search"

    def __init__(self, config: dict | None = None):
        self.config = config or {}
        self.serpapi_key = self.config.get("serpapi_key") or os.getenv("SERPAPI_KEY")
        self.max_results = self.config.get("max_results", 5)

    def run(self, query: str) -> list[dict[str, str]]:
        """
        Execute a search query.

        Args:
            query: Search string.

        Returns:
            List of result dicts (title, url, snippet, source).
        """
        logger.info(f"[{self.TOOL_NAME}] query={query!r}")

        if self.serpapi_key:
            return self._serpapi_search(query)

        try:
            return self._duckduckgo_search(query)
        except Exception as exc:
            logger.warning(f"DuckDuckGo search failed ({exc}), using mock results")
            return self._mock_results(query)

    def _serpapi_search(self, query: str) -> list[dict[str, str]]:
        """Search via SerpAPI (requires API key)."""
        params = urllib.parse.urlencode({
            "q": query,
            "api_key": self.serpapi_key,
            "num": self.max_results,
            "engine": "google",
        })
        url = f"https://serpapi.com/search?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": "factory-ai/1.0"})

        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())

        results = []
        for item in data.get("organic_results", [])[: self.max_results]:
            results.append({
                "title":   item.get("title", ""),
                "url":     item.get("link", ""),
                "snippet": item.get("snippet", ""),
                "source":  "serpapi",
            })
        return results

    def _duckduckgo_search(self, query: str) -> list[dict[str, str]]:
        """
        Lightweight DuckDuckGo Instant Answer API (JSON, no key).
        Note: Returns abstract text only, not a full SERP.
        """
        params = urllib.parse.urlencode({
            "q": query,
            "format": "json",
            "no_html": "1",
            "skip_disambig": "1",
        })
        url = f"https://api.duckduckgo.com/?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": "factory-ai/1.0"})

        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())

        results = []

        if data.get("Abstract"):
            results.append({
                "title":   data.get("Heading", query),
                "url":     data.get("AbstractURL", ""),
                "snippet": data.get("Abstract", ""),
                "source":  "duckduckgo",
            })

        for topic in data.get("RelatedTopics", [])[: self.max_results - 1]:
            if "Text" in topic and "FirstURL" in topic:
                results.append({
                    "title":   topic.get("Text", "")[:80],
                    "url":     topic.get("FirstURL", ""),
                    "snippet": topic.get("Text", ""),
                    "source":  "duckduckgo",
                })

        return results or self._mock_results(query)

    def _mock_results(self, query: str) -> list[dict[str, str]]:
        """Fallback mock data for offline / test environments."""
        return [
            {
                "title":   f"[MOCK] Result 1 for: {query}",
                "url":     "https://example.com/1",
                "snippet": f"Mock search result for query: {query}. Configure SERPAPI_KEY for real results.",
                "source":  "mock",
            },
            {
                "title":   f"[MOCK] Result 2 for: {query}",
                "url":     "https://example.com/2",
                "snippet": f"Second mock result. In production this would contain relevant web content.",
                "source":  "mock",
            },
        ]

    def format_for_prompt(self, query: str) -> str:
        """Run search and format results as a markdown block for LLM injection."""
        results = self.run(query)
        lines = [f"## Web Search Results for: {query!r}\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. **{r['title']}**")
            lines.append(f"   URL: {r['url']}")
            lines.append(f"   {r['snippet']}\n")
        return "\n".join(lines)
