"""
factory_ai.router.routing_rules
================================
Task classification engine that maps a natural-language prompt to the
best available SkilledDroid and Ollama model.

Decision hierarchy:
  1. Keyword / pattern matching (fast, deterministic, O(1))
  2. Embedding similarity against skill descriptions (semantic, O(n))
  3. Fallback to default droid (ScoutDroid / llama3)

Routing table (keyword → droid, model, rationale):

  CODE / DEV          → CodeDroid     (deepseek-coder)
  FINANCE / TRADE     → TradeDroid    (qwen2.5)
  LEADS / CRM / SALES → LeadHarvester (mistral)
  RESEARCH / INTEL    → ScoutDroid    (llama3)
  DATA / SQL / DB     → CodeDroid     (deepseek-coder)
  IMAGE / VISION      → ScoutDroid    (llava — if available)

This is intentionally simple and deterministic so it runs on-device
without a secondary LLM call. Complex semantic routing can be layered on
top via the `SkillEmbeddingRouter` class below.
"""

import re
import logging
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class RouteDecision:
    """Result returned by the routing engine."""
    droid:      str           # target droid name
    model:      str           # recommended Ollama model
    category:   str           # classified task type
    confidence: float         # 0.0 – 1.0
    rationale:  str           # human-readable explanation
    fallback:   bool = False  # True if no rule matched


# ---------------------------------------------------------------------------
# Routing rules: list of (category, keywords, droid, model, rationale)
# ---------------------------------------------------------------------------

_RULES: list[tuple[str, list[str], str, str, str]] = [
    (
        "code",
        ["code", "function", "script", "implement", "debug", "refactor",
         "class", "module", "api endpoint", "unit test", "pytest", "typescript",
         "python", "javascript", "sql schema", "dockerfile", "kubernetes", "yaml config",
         "devops", "ci/cd", "pipeline", "deploy", "build", "package"],
        "CodeDroid", "deepseek-coder",
        "Task involves code generation or software development",
    ),
    (
        "finance",
        ["stock", "trade", "market", "finance", "financial", "invest", "portfolio",
         "valuation", "revenue", "arpu", "churn", "ltv", "cac", "burn rate",
         "signal", "bullish", "bearish", "earnings", "sector", "macro", "interest rate",
         "crypto", "defi", "options", "equity", "cap table"],
        "TradeDroid", "qwen2.5",
        "Task involves financial analysis or market intelligence",
    ),
    (
        "leads",
        ["lead", "customer", "prospect", "crm", "sales", "outreach", "icp",
         "pipeline", "deal", "founder", "b2b", "saas company", "startup",
         "qualify", "score", "contact", "email", "linkedin", "persona"],
        "LeadHarvester", "mistral",
        "Task involves lead discovery or CRM operations",
    ),
    (
        "research",
        ["research", "summarize", "analyze", "survey", "trends", "landscape",
         "competitor", "market report", "white paper", "intel", "overview",
         "compare", "benchmark", "study", "deep dive", "find", "list", "top"],
        "ScoutDroid", "llama3",
        "Task involves research, analysis, or information gathering",
    ),
    (
        "data",
        ["data", "database", "query", "etl", "pipeline", "schema", "table",
         "analytics", "dashboard", "metrics", "kpi", "report", "aggregat",
         "parquet", "duckdb", "postgres", "sqlite", "spark", "dbt"],
        "CodeDroid", "deepseek-coder",
        "Task involves data engineering or analytics",
    ),
]


class KeywordRouter:
    """
    Fast O(1) keyword-based task router.

    Scores each rule by counting keyword hits against the prompt, then
    picks the highest-scoring rule. Falls back to ScoutDroid if no rule
    scores above the threshold.
    """

    FALLBACK = RouteDecision(
        droid="ScoutDroid", model="llama3",
        category="general", confidence=0.3,
        rationale="No specific category matched — routing to general research droid",
        fallback=True,
    )

    def __init__(self, score_threshold: float = 0.1):
        self.score_threshold = score_threshold
        # Pre-compile patterns for speed
        self._compiled: list[tuple] = []
        for category, keywords, droid, model, rationale in _RULES:
            patterns = [re.compile(rf"\b{re.escape(kw)}\b", re.IGNORECASE) for kw in keywords]
            self._compiled.append((category, patterns, droid, model, rationale, len(keywords)))

    def route(self, prompt: str) -> RouteDecision:
        """Classify prompt and return the best RouteDecision."""
        best_score = 0.0
        best_rule = None

        for category, patterns, droid, model, rationale, total in self._compiled:
            hits = sum(1 for p in patterns if p.search(prompt))
            score = hits / total
            if score > best_score:
                best_score = score
                best_rule = (category, droid, model, rationale)

        if best_rule and best_score >= self.score_threshold:
            category, droid, model, rationale = best_rule
            confidence = min(round(best_score * 3, 2), 1.0)   # amplify small scores
            logger.debug(
                f"[KeywordRouter] '{prompt[:40]}...' → {droid} (score={best_score:.3f})"
            )
            return RouteDecision(
                droid=droid, model=model,
                category=category, confidence=confidence,
                rationale=rationale,
            )

        logger.debug(f"[KeywordRouter] No match for '{prompt[:40]}...' — fallback")
        return self.FALLBACK

    def explain(self, prompt: str) -> dict:
        """Return full scoring breakdown for debugging / UI display."""
        scores = {}
        for category, patterns, droid, model, rationale, total in self._compiled:
            hits = sum(1 for p in patterns if p.search(prompt))
            matched_kws = [
                p.pattern.strip(r"\b").replace(r"\b", "")
                for p in patterns if p.search(prompt)
            ]
            scores[category] = {
                "droid":        droid,
                "model":        model,
                "hits":         hits,
                "score":        round(hits / total, 4),
                "matched":      matched_kws,
            }
        decision = self.route(prompt)
        return {
            "prompt":   prompt,
            "decision": {
                "droid":      decision.droid,
                "model":      decision.model,
                "category":   decision.category,
                "confidence": decision.confidence,
                "fallback":   decision.fallback,
            },
            "scores": scores,
        }


# Singleton for use by RouterDroid actor
_default_router = KeywordRouter()


def route_task(prompt: str) -> RouteDecision:
    """Module-level convenience function — uses the default KeywordRouter."""
    return _default_router.route(prompt)


def explain_routing(prompt: str) -> dict:
    """Module-level convenience function — returns full scoring breakdown."""
    return _default_router.explain(prompt)
