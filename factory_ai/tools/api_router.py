"""
Tool: APIRouterTool
--------------------
Routes HTTP API calls on behalf of droid agents.

Supports:
  - GET / POST / PUT / DELETE requests
  - JSON and form-encoded payloads
  - Bearer token and API key authentication
  - Response caching (TTL-based, in-memory)
  - Rate limiting (per-domain, configurable)

Used by: all droids that need to hit external APIs (CRM, market data, etc.)

Samsung S25 Ultra note:
  On Android / Termux, this tool works identically.
  Set FACTORY_API_PROXY env var to route through a local proxy if needed.
"""

import json
import time
import os
import hashlib
import urllib.parse
import urllib.request
import urllib.error
import logging
from typing import Any

logger = logging.getLogger(__name__)


class APIRouterTool:
    """
    Generic HTTP API call router for droid tool use.

    Accepts a call spec dict:
      {
        "url":     str,           # required
        "method":  "GET"|"POST",  # default GET
        "headers": dict,          # optional extra headers
        "params":  dict,          # query string params
        "body":    dict | str,    # POST body (dict → JSON)
        "auth":    {              # optional auth
          "type":  "bearer" | "apikey" | "basic",
          "token": str,
          "header": str           # header name for apikey (default X-API-Key)
        },
        "timeout": int            # seconds, default 15
      }
    """

    TOOL_NAME = "api_router"

    def __init__(self, config: dict | None = None):
        self.config = config or {}
        self.cache_ttl = self.config.get("cache_ttl", 300)        # 5 min default
        self.rate_limit = self.config.get("rate_limit_rps", 5)    # req/sec per domain
        self._cache: dict[str, tuple[float, Any]] = {}            # key → (ts, data)
        self._rate_tracker: dict[str, list[float]] = {}           # domain → [timestamps]
        self._proxy = os.getenv("FACTORY_API_PROXY", "")

    def run(self, call_spec: dict[str, Any]) -> dict[str, Any]:
        """
        Execute an HTTP API call.

        Returns:
          {
            "status_code": int,
            "body":        dict | str,
            "headers":     dict,
            "cached":      bool,
            "error":       str | None
          }
        """
        url = call_spec.get("url")
        if not url:
            return {"status_code": 0, "body": None, "headers": {}, "cached": False,
                    "error": "url is required"}

        method = call_spec.get("method", "GET").upper()
        params = call_spec.get("params", {})
        body = call_spec.get("body")
        headers = dict(call_spec.get("headers", {}))
        auth = call_spec.get("auth", {})
        timeout = call_spec.get("timeout", 15)

        # Build full URL with query params
        if params:
            url = url + "?" + urllib.parse.urlencode(params)

        # Auth headers
        self._apply_auth(headers, auth)

        # Cache check (GET only)
        cache_key = hashlib.md5(f"{method}{url}{json.dumps(headers, sort_keys=True)}".encode()).hexdigest()
        if method == "GET" and cache_key in self._cache:
            ts, cached_resp = self._cache[cache_key]
            if time.monotonic() - ts < self.cache_ttl:
                logger.debug(f"[{self.TOOL_NAME}] Cache HIT: {url}")
                return {**cached_resp, "cached": True}

        # Rate limiting
        domain = urllib.parse.urlparse(url).netloc
        self._check_rate_limit(domain)

        # Execute request
        logger.info(f"[{self.TOOL_NAME}] {method} {url}")
        try:
            result = self._execute(url, method, headers, body, timeout)
        except Exception as exc:
            logger.error(f"[{self.TOOL_NAME}] Request failed: {exc}")
            return {"status_code": 0, "body": None, "headers": {}, "cached": False,
                    "error": str(exc)}

        # Cache successful GET responses
        if method == "GET" and result["status_code"] < 400:
            self._cache[cache_key] = (time.monotonic(), result)

        return result

    def _execute(
        self, url: str, method: str, headers: dict, body: Any, timeout: int
    ) -> dict[str, Any]:
        encoded_body = None
        if body is not None:
            if isinstance(body, dict):
                encoded_body = json.dumps(body).encode("utf-8")
                headers.setdefault("Content-Type", "application/json")
            else:
                encoded_body = str(body).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=encoded_body,
            headers={**{"User-Agent": "factory-ai/1.0"}, **headers},
            method=method,
        )

        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read()
                resp_headers = dict(resp.headers)
                try:
                    parsed_body = json.loads(raw)
                except json.JSONDecodeError:
                    parsed_body = raw.decode("utf-8", errors="replace")

                return {
                    "status_code": resp.status,
                    "body":        parsed_body,
                    "headers":     resp_headers,
                    "cached":      False,
                    "error":       None,
                }
        except urllib.error.HTTPError as exc:
            return {
                "status_code": exc.code,
                "body":        exc.reason,
                "headers":     {},
                "cached":      False,
                "error":       f"HTTP {exc.code}: {exc.reason}",
            }

    def _apply_auth(self, headers: dict, auth: dict):
        """Inject authentication headers."""
        auth_type = auth.get("type", "").lower()
        token = auth.get("token") or ""

        if auth_type == "bearer":
            headers["Authorization"] = f"Bearer {token}"
        elif auth_type == "apikey":
            header_name = auth.get("header", "X-API-Key")
            headers[header_name] = token
        elif auth_type == "basic":
            import base64
            encoded = base64.b64encode(token.encode()).decode()
            headers["Authorization"] = f"Basic {encoded}"

    def _check_rate_limit(self, domain: str):
        """Simple sliding-window rate limiter."""
        now = time.monotonic()
        timestamps = self._rate_tracker.get(domain, [])
        # Keep only timestamps within the last second
        timestamps = [t for t in timestamps if now - t < 1.0]
        if len(timestamps) >= self.rate_limit:
            sleep_for = 1.0 - (now - timestamps[0])
            if sleep_for > 0:
                logger.debug(f"[{self.TOOL_NAME}] Rate limit — sleeping {sleep_for:.2f}s for {domain}")
                time.sleep(sleep_for)
            timestamps = []
        timestamps.append(time.monotonic())
        self._rate_tracker[domain] = timestamps

    def format_for_prompt(self, call_spec: dict) -> str:
        """Execute call and format response as markdown for LLM injection."""
        result = self.run(call_spec)
        if result.get("error"):
            return f"## API Error\nURL: {call_spec.get('url')}\nError: {result['error']}"
        body = result["body"]
        if isinstance(body, dict):
            body_str = json.dumps(body, indent=2)[:1000]
        else:
            body_str = str(body)[:1000]
        return (
            f"## API Response\n"
            f"URL: {call_spec.get('url')}\n"
            f"Status: {result['status_code']}\n"
            f"Cached: {result['cached']}\n\n"
            f"```json\n{body_str}\n```"
        )
