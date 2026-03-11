"""
factory_ai — Factory.ai Skilled Droid Creation Pipeline  (v2)
==============================================================
Stack: Ray.io · Ollama · Samsung Galaxy S25 Ultra (control node)

Architecture:
  DroidFactory     → compiles skill manifests into Ray actors
  SkilledDroid     → Ray actor + Ollama model + tool plugin registry
  RouterDroid      → intelligent task classifier + dispatcher
  VectorMemory     → Chroma long-term semantic memory per droid
  EpisodicLog      → DuckDB structured task history per droid
  MessageBus       → Redis Streams agent-to-agent messaging

Sub-packages:
  factory_ai.tools       — web_search, vector_store, database_query, api_router
  factory_ai.memory      — VectorMemory (Chroma), EpisodicLog (DuckDB)
  factory_ai.router      — RouterDroid, KeywordRouter, RouteDecision
  factory_ai.messaging   — MessageBus (Redis Streams / in-memory)
  factory_ai.cluster     — multi-device Ray cluster config + node setup
"""

from .factory import DroidFactory, SkillManifest
from .droid_actor import SkilledDroid
from .router import RouterDroid, KeywordRouter, RouteDecision, route_task
from .memory import VectorMemory, EpisodicLog
from .messaging import MessageBus, get_bus

__all__ = [
    # Core
    "DroidFactory",
    "SkilledDroid",
    "SkillManifest",
    # Router
    "RouterDroid",
    "KeywordRouter",
    "RouteDecision",
    "route_task",
    # Memory
    "VectorMemory",
    "EpisodicLog",
    # Messaging
    "MessageBus",
    "get_bus",
]

__version__ = "2.0.0"
