"""
factory_ai.messaging — Agent-to-Agent Message Bus
===================================================

Provides a Redis Streams-backed pub/sub layer that lets SkilledDroids
communicate with each other without going through the DroidFactory.

Typical patterns:
  ScoutDroid   → (research results) → TradeDroid
  LeadHarvester → (qualified lead)  → CodeDroid
  RouterDroid  → (broadcast signal) → all droids
  TradeDroid   → (buy signal)       → LeadHarvester

Key concepts:
  - Each droid has an inbox stream and an outbox stream
  - A global broadcast channel for factory-wide signals
  - Messages are persistent until acknowledged (Redis Streams)
  - In-memory fallback for zero-dependency testing

Stream keys:
  factory:droid:<name>:inbox
  factory:droid:<name>:outbox
  factory:broadcast
"""

from .message_bus import MessageBus

# Module-level singleton — share one connection pool across all droids
_bus_instance: MessageBus | None = None


def get_bus(redis_url: str | None = None) -> MessageBus:
    """Return the shared MessageBus singleton (initializes on first call)."""
    global _bus_instance
    if _bus_instance is None:
        _bus_instance = MessageBus(redis_url=redis_url)
    return _bus_instance


__all__ = ["MessageBus", "get_bus"]
