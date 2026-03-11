"""
factory_ai.messaging.message_bus
==================================
Agent-to-agent message bus backed by Redis Streams.

Architecture:
  Each droid has two logical endpoints:
    - An OUTBOX stream  → messages published by the droid
    - An INBOX stream   → messages addressed to the droid

  Stream key convention:
    factory:droid:<name>:inbox
    factory:droid:<name>:outbox
    factory:broadcast          ← global channel (all droids)

  Message envelope:
    {
      "msg_id":     str,     ← Redis stream entry ID
      "from_droid": str,
      "to_droid":   str | "*" (broadcast),
      "type":       str,     ← "task_result" | "request" | "signal" | "data"
      "payload":    str,     ← JSON-encoded content
      "timestamp":  float
    }

Backends:
  1. Redis Streams (recommended — persistent, ordered, consumer groups)
  2. In-memory queue dict (fallback — single-process only, testing)

Redis Streams chosen over pub/sub because:
  - Messages are persisted until acknowledged (no message loss)
  - Consumer groups allow multiple droids to compete for the same work
  - Replay is possible (re-read from any stream offset)
  - XLEN provides backpressure visibility
"""

import json
import time
import uuid
import logging
from typing import Any

logger = logging.getLogger(__name__)

# Stream key builders
_INBOX  = lambda name: f"factory:droid:{name}:inbox"
_OUTBOX = lambda name: f"factory:droid:{name}:outbox"
_BCAST  = "factory:broadcast"

# Max entries per stream before trimming (MAXLEN)
_STREAM_MAXLEN = 500


class MessageBus:
    """
    Agent-to-agent message bus.

    Usage:
        bus = MessageBus()

        # Droid A publishes a result to Droid B
        bus.publish(from_droid="ScoutDroid", to_droid="TradeDroid",
                    msg_type="data", payload={"research": "..."})

        # Droid B reads its inbox
        messages = bus.consume(droid_name="TradeDroid", count=10)

        # Broadcast to all droids
        bus.broadcast(from_droid="RouterDroid", payload={"signal": "shutdown"})
    """

    def __init__(
        self,
        redis_url: str | None = None,
        backend: str = "auto",
    ):
        import os
        self.redis_url = redis_url or os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.backend = backend
        self._redis = None
        self._queues: dict[str, list[dict]] = {}   # in-memory fallback
        self._init()

    def _init(self):
        if self.backend in ("auto", "redis"):
            try:
                import redis as redis_lib  # type: ignore
                self._redis = redis_lib.Redis.from_url(self.redis_url, decode_responses=True)
                self._redis.ping()
                self.backend = "redis"
                logger.info(f"[MessageBus] Redis Streams backend | url={self.redis_url}")
                return
            except ImportError:
                logger.debug("redis-py not installed")
            except Exception as exc:
                logger.warning(f"Redis connection failed ({exc}) — using in-memory bus")

        self.backend = "memory"
        logger.warning("[MessageBus] In-memory queue (no persistence, single-process only)")

    # ------------------------------------------------------------------
    # Publish
    # ------------------------------------------------------------------

    def publish(
        self,
        from_droid: str,
        to_droid: str,
        payload: Any,
        msg_type: str = "data",
    ) -> str:
        """
        Send a message from one droid to another.

        Args:
            from_droid: Sender droid name.
            to_droid:   Recipient droid name (or "*" for broadcast).
            payload:    Serializable Python object.
            msg_type:   Message classification (data | request | signal | task_result).

        Returns:
            Message ID string.
        """
        msg_id = str(uuid.uuid4())[:8]
        envelope = {
            "msg_id":     msg_id,
            "from_droid": from_droid,
            "to_droid":   to_droid,
            "type":       msg_type,
            "payload":    json.dumps(payload),
            "timestamp":  time.time(),
        }

        if self.backend == "redis":
            inbox_key = _BCAST if to_droid == "*" else _INBOX(to_droid)
            outbox_key = _OUTBOX(from_droid)
            self._redis.xadd(inbox_key,  envelope, maxlen=_STREAM_MAXLEN)
            self._redis.xadd(outbox_key, envelope, maxlen=_STREAM_MAXLEN)
            logger.debug(f"[MessageBus] {from_droid} → {to_droid} | type={msg_type} | id={msg_id}")
        else:
            inbox_key = "broadcast" if to_droid == "*" else f"inbox:{to_droid}"
            self._queues.setdefault(inbox_key, []).append(envelope)
            self._queues.setdefault(f"outbox:{from_droid}", []).append(envelope)
            if len(self._queues[inbox_key]) > _STREAM_MAXLEN:
                self._queues[inbox_key] = self._queues[inbox_key][-_STREAM_MAXLEN:]

        return msg_id

    def broadcast(self, from_droid: str, payload: Any, msg_type: str = "signal") -> str:
        """Publish a message to all droids via the broadcast channel."""
        return self.publish(from_droid, "*", payload, msg_type)

    # ------------------------------------------------------------------
    # Consume
    # ------------------------------------------------------------------

    def consume(
        self,
        droid_name: str,
        count: int = 10,
        last_id: str = "0",      # "0" = from beginning; "$" = new messages only
    ) -> list[dict[str, Any]]:
        """
        Read messages from a droid's inbox.

        Args:
            droid_name: The receiving droid.
            count:      Maximum number of messages to return.
            last_id:    Redis stream offset ("0"=all, "$"=new-only, or a prior msg ID).

        Returns:
            List of decoded envelope dicts (payload is deserialized JSON).
        """
        if self.backend == "redis":
            inbox_key = _INBOX(droid_name)
            entries = self._redis.xread({inbox_key: last_id}, count=count, block=0)
            if not entries:
                return []
            messages = []
            for _stream, records in entries:
                for _entry_id, fields in records:
                    msg = dict(fields)
                    try:
                        msg["payload"] = json.loads(msg.get("payload", "{}"))
                    except json.JSONDecodeError:
                        pass
                    msg["stream_id"] = _entry_id
                    messages.append(msg)
            return messages

        inbox_key = f"inbox:{droid_name}"
        raw = self._queues.get(inbox_key, [])
        msgs = raw[-count:]
        result = []
        for m in msgs:
            parsed = dict(m)
            try:
                parsed["payload"] = json.loads(parsed.get("payload", "{}"))
            except json.JSONDecodeError:
                pass
            result.append(parsed)
        return result

    def consume_broadcast(self, count: int = 10, last_id: str = "0") -> list[dict[str, Any]]:
        """Read global broadcast messages."""
        if self.backend == "redis":
            entries = self._redis.xread({_BCAST: last_id}, count=count, block=0)
            if not entries:
                return []
            return [dict(f) for _s, recs in entries for _id, f in recs]
        return self._queues.get("broadcast", [])[-count:]

    # ------------------------------------------------------------------
    # Inspect
    # ------------------------------------------------------------------

    def queue_depth(self, droid_name: str) -> dict[str, int]:
        """Return inbox and outbox message counts for a droid."""
        if self.backend == "redis":
            return {
                "inbox":     self._redis.xlen(_INBOX(droid_name)),
                "outbox":    self._redis.xlen(_OUTBOX(droid_name)),
                "broadcast": self._redis.xlen(_BCAST),
            }
        return {
            "inbox":     len(self._queues.get(f"inbox:{droid_name}", [])),
            "outbox":    len(self._queues.get(f"outbox:{droid_name}", [])),
            "broadcast": len(self._queues.get("broadcast", [])),
        }

    def get_stats(self) -> dict[str, Any]:
        return {
            "backend":    self.backend,
            "redis_url":  self.redis_url if self.backend == "redis" else None,
            "channels":   list(self._queues.keys()) if self.backend == "memory" else "redis-streams",
        }

    def flush(self, droid_name: str) -> None:
        """Clear a droid's inbox (use with care)."""
        if self.backend == "redis":
            self._redis.delete(_INBOX(droid_name))
        else:
            self._queues.pop(f"inbox:{droid_name}", None)
