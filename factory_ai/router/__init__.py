"""
factory_ai.router — Intelligent Task Routing Layer
====================================================

Components:
  RouterDroid     Ray actor that classifies + dispatches tasks to the
                  best available SkilledDroid worker.

  KeywordRouter   Fast O(1) keyword/pattern-based task classifier.
                  Maps prompts to (droid, model, category, confidence).

  RouteDecision   Dataclass representing a routing result.

  route_task()    Module-level convenience: classify a prompt instantly.

Routing logic:
  code/dev/data   → CodeDroid     (deepseek-coder)
  finance/trade   → TradeDroid    (qwen2.5)
  leads/crm/sales → LeadHarvester (mistral)
  research/intel  → ScoutDroid    (llama3)
  fallback        → ScoutDroid    (llama3)
"""

from .routing_rules import KeywordRouter, RouteDecision, route_task, explain_routing
from .router_droid import RouterDroid

__all__ = [
    "RouterDroid",
    "KeywordRouter",
    "RouteDecision",
    "route_task",
    "explain_routing",
]
