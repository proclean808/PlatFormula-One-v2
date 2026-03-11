"""
factory_ai.memory — Persistent Agent Memory Layer
==================================================

Three-tier memory architecture per SkilledDroid:

  ┌─────────────────────────────────────────────────┐
  │  SkilledDroid memory stack                      │
  │                                                 │
  │  Tier 1: short_term_buffer  (in-actor ring buf) │
  │  Tier 2: vector_memory      (Chroma embeddings) │
  │  Tier 3: episodic_log       (DuckDB fact store) │
  └─────────────────────────────────────────────────┘

Tier 1 is implemented directly in droid_actor.py (_history ring buffer).
Tiers 2 and 3 are provided by this package.
"""

from .vector_memory import VectorMemory
from .episodic_log import EpisodicLog

__all__ = ["VectorMemory", "EpisodicLog"]
