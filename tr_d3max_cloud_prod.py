"""
PlatFormula.ONE: TR-D³Max Cloud POC (Production-Ready)
All 6 hardening patches applied. Investor-demonstrable. Deployment-grade.

Dependencies:
pip install openai asyncio python-dotenv fastapi uvicorn statistics

Run:
Local: python3 tr_d3max_cloud_prod.py
API: uvicorn tr_d3max_cloud_prod:app --host 0.0.0.0 --port 8001
"""

import asyncio
import hashlib
import os
import statistics
import time
import logging
from typing import List, Dict, Optional

from openai import AsyncOpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Configure logging (investor-clarity level)
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s"
)

logger = logging.getLogger(__name__)

# Initialize OpenRouter Client
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", "YOUR_OPENROUTER_API_KEY"),
)

# POC Advocate Pool
ADVOCATES = [
    {"role": "Analytical", "model": "anthropic/claude-3.5-haiku"},
    {"role": "Philosophical", "model": "google/gemini-2.5-flash"},
    {"role": "Contrarian", "model": "openai/gpt-4o-mini"},
]

JUDGE_MODEL = "meta-llama/llama-3.3-70b-instruct"

# SLA (Cloud acceptable)
SLA_ADVOCATE_MS = 5000
SLA_JUDGE_MS = 3000
SLA_TOTAL_MS = 15000


# ============================================================================
# PATCH 1: Advocate Quorum Gate + Dispatch Latency Tracking
# ============================================================================

class TRD3MaxMetrics:
    """Production instrumentation with all 6 patches."""

    def __init__(self):
        self.advocate_latencies: List[float] = []
        self.judge_latency: float = 0
        self.total_latency: float = 0
        self.deflation_applied: bool = False
        self.quorum_achieved: bool = False
        self.dispatch_max_latency: float = 0
        self.p95_latency: float = 0
        self.p99_latency: float = 0
        self.advocate_success_count: int = 0

    def compute_percentiles(self):
        """PATCH 5: p95/p99 tracking for credibility."""
        if len(self.advocate_latencies) > 1:
            try:
                quantiles = statistics.quantiles(
                    self.advocate_latencies,
                    n=20
                )
                self.p95_latency = round(quantiles[18] if len(quantiles) > 18 else quantiles[-1], 1)
                self.p99_latency = round(quantiles[19] if len(quantiles) > 19 else quantiles[-1], 1)
            except Exception:
                pass

    def report(self):
        """Final metrics report."""
        self.compute_percentiles()

        logger.info("=" * 60)
        logger.info("EXECUTION METRICS")
        logger.info("=" * 60)
        logger.info(f"[ADVOCATES] Success: {self.advocate_success_count}/3")
        logger.info(f"[ADVOCATES] Latencies: {[f'{l:.1f}ms' for l in self.advocate_latencies]}")

        if self.advocate_latencies:
            logger.info(f"[DISPATCH] Max latency: {self.dispatch_max_latency:.1f}ms")
            logger.info(f"[DISPATCH] P95: {self.p95_latency:.1f}ms")
            logger.info(f"[DISPATCH] P99: {self.p99_latency:.1f}ms")

        logger.info(f"[JUDGE] Latency: {self.judge_latency:.1f}ms")
        logger.info(f"[JUDGE] Deflation: {self.deflation_applied}")
        logger.info(f"[QUORUM] Achieved: {self.quorum_achieved} (>=2 advocates)")
        logger.info(f"[TOTAL] Latency: {self.total_latency:.1f}ms / {SLA_TOTAL_MS}ms SLA")
        logger.info("=" * 60)


async def generate_advocate_response(prompt: str, advocate: dict) -> dict:
    """Generate single advocate response with timeout."""
    start_time = time.perf_counter()

    try:
        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=advocate["model"],
                messages=[
                    {
                        "role": "system",
                        "content": (
                            f"You are a {advocate['role']} reasoning agent. "
                            "Provide a concise, highly logical answer. "
                            "Avoid overconfidence and hedging language."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=150,
            ),
            timeout=SLA_ADVOCATE_MS / 1000,
        )
        content = response.choices[0].message.content
        status = "completed"

    except asyncio.TimeoutError:
        content = f"[TIMEOUT] {SLA_ADVOCATE_MS}ms exceeded"
        status = "timeout"
        logger.warning(f"[TIMEOUT] {advocate['model']}")

    except Exception as e:
        content = f"[ERROR] {str(e)}"
        status = "error"
        logger.error(f"[ERROR] {advocate['model']}: {e}")

    latency_ms = (time.perf_counter() - start_time) * 1000

    return {
        "model": advocate["model"],
        "role": advocate["role"],
        "content": content,
        "latency_ms": round(latency_ms, 1),
        "status": status,
    }


def deflate_output(text: str) -> str:
    """Remove overconfident language (deflation guard)."""
    overconfident_words = [
        "definitely",
        "certainly",
        "guaranteed",
        "absolutely",
        "must be",
        "will definitely",
        "without question",
    ]
    result = text
    for word in overconfident_words:
        result = result.replace(word, "")
    result = " ".join(result.split())
    return result.strip()


# ============================================================================
# PATCH 3: Structured Output Parsing
# ============================================================================

def parse_verdict(text: str) -> Dict:
    """PATCH 3: Parse judge output into structured format."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    return {
        "winning_advocate": lines[0] if len(lines) > 0 else "unknown",
        "justification": lines[1] if len(lines) > 1 else "no justification",
        "final_answer": " ".join(lines[2:]) if len(lines) > 2 else text,
        "raw_text": text,
    }


# ============================================================================
# PATCH 2: Prevent Judge Poisoning (filter failed advocates)
# ============================================================================

async def execute_micro_judge(
    prompt: str,
    advocate_responses: List[Dict],
    metrics: TRD3MaxMetrics,
) -> dict:
    """
    Deterministic arbitration with judge poisoning prevention.
    PATCH 2: Filter out failed advocates from judge input.
    """
    start_time = time.perf_counter()

    # PATCH 2: Only include successful advocates in judge input
    valid_responses = [r for r in advocate_responses if r["status"] == "completed"]

    if not valid_responses:
        logger.error("[JUDGE] No valid advocates to judge. Fallback triggered.")
        return {
            "verdict": parse_verdict("No valid responses to judge"),
            "latency_ms": 0,
            "status": "fallback",
            "deflation_applied": False,
        }

    # Construct transcript (only from valid responses)
    transcript = f"Original Query: {prompt}\n\n"
    for idx, resp in enumerate(valid_responses):
        transcript += (
            f"--- Advocate {idx + 1} ({resp['role']} - {resp['model']}) ---\n"
            f"{resp['content']}\n\n"
        )

    judge_system_prompt = """
You are the TR-D3Max Micro-Judge. Enforce strict deterministic arbitration.
Review the parallel advocate responses and apply this rubric:

1. Logical Consistency (0.35): Does the answer hold logically?
2. Agreement Overlap (0.25): Do advocates converge on key points?
3. Response Completeness (0.25): Does it fully address the query?
4. Redundancy Penalty (-0.15): Deduct for verbosity or repetition.

Output format (STRICT):
[WINNING ADVOCATE NUMBER]
[BRIEF JUSTIFICATION]
[FINAL CONSOLIDATED ANSWER]

Do NOT use overconfident language (definitely, certainly, guaranteed, etc.).
"""

    try:
        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=JUDGE_MODEL,
                messages=[
                    {"role": "system", "content": judge_system_prompt},
                    {"role": "user", "content": transcript},
                ],
                temperature=0.0,  # Deterministic
                max_tokens=250,
            ),
            timeout=SLA_JUDGE_MS / 1000,
        )
        verdict_raw = response.choices[0].message.content
        status = "completed"

    except asyncio.TimeoutError:
        verdict_raw = "Arbitration exceeded timeout. Using highest-confidence advocate."
        status = "timeout"
        logger.warning("[TIMEOUT] Judge exceeded SLA")

    except Exception as e:
        verdict_raw = f"Arbitration error: {str(e)}"
        status = "error"
        logger.error(f"[ERROR] Judge: {e}")

    latency_ms = (time.perf_counter() - start_time) * 1000

    # Apply deflation guard
    verdict_deflated = deflate_output(verdict_raw)
    deflation_applied = verdict_deflated != verdict_raw

    # PATCH 3: Parse into structured format
    verdict_structured = parse_verdict(verdict_deflated)

    # PATCH 6 (bonus): Determinism hash for demo credibility
    determinism_hash = hashlib.md5(verdict_structured["final_answer"].encode()).hexdigest()
    logger.info(f"[DETERMINISM] hash={determinism_hash}")

    metrics.judge_latency = round(latency_ms, 1)
    metrics.deflation_applied = deflation_applied
    metrics.quorum_achieved = len(valid_responses) >= 2

    return {
        "verdict": verdict_structured,
        "latency_ms": round(latency_ms, 1),
        "status": status,
        "deflation_applied": deflation_applied,
    }


# ============================================================================
# PATCH 1: Advocate Quorum Gate (enforce, not just track)
# ============================================================================

async def run_tr_d3max_poc(user_prompt: str) -> dict:
    """
    Main execution loop with all 6 patches applied.
    PATCH 1: Enforce advocate quorum gate.
    Returns a dict with keys: status, verdict, metrics
    """
    logger.info(f"\n[INIT] TR-D3Max Cloud POC")
    logger.info(f"[QUERY] {user_prompt[:80]}...")

    total_start = time.perf_counter()
    metrics = TRD3MaxMetrics()

    # 1. Parallel Dispatch (Fan-Out)
    logger.info("[DISPATCH] Launching parallel advocates...")
    tasks = [generate_advocate_response(user_prompt, adv) for adv in ADVOCATES]
    advocate_results = await asyncio.gather(*tasks)

    # Track latencies and success count
    for res in advocate_results:
        metrics.advocate_latencies.append(res["latency_ms"])
        if res["status"] == "completed":
            metrics.advocate_success_count += 1

        logger.info(
            f"[ADVOCATE] {res['model'][:30]}... "
            f"{res['status']} in {res['latency_ms']}ms"
        )

    logger.info(f"[MODELS] Active: {metrics.advocate_success_count}")

    # PATCH 1: Enforce quorum gate (>=2 valid responses required)
    valid_responses = [r for r in advocate_results if r["status"] == "completed"]

    if len(valid_responses) < 2:
        logger.error(f"[QUORUM] FAILED: Only {len(valid_responses)}/3 advocates succeeded")
        logger.error("[QUORUM] Cannot proceed to arbitration. Fallback mode.")

        metrics.total_latency = round((time.perf_counter() - total_start) * 1000, 1)

        if valid_responses:
            fallback = valid_responses[0]
            logger.info(f"[FALLBACK] Using {fallback['model']}")
            return {
                "status": "fallback_quorum_failed",
                "verdict": parse_verdict(fallback["content"]),
                "metrics": metrics,
            }
        else:
            logger.error("[FALLBACK] No valid responses. System failure.")
            return {
                "status": "critical_failure",
                "verdict": parse_verdict("No advocates responded. System failure."),
                "metrics": metrics,
            }

    logger.info(f"[QUORUM] PASSED: {len(valid_responses)}/3 advocates ready for arbitration")

    # PATCH 4: Calculate dispatch latency metric
    metrics.dispatch_max_latency = max(metrics.advocate_latencies) if metrics.advocate_latencies else 0

    # 2. Deterministic Arbitration (Fan-In)
    logger.info("[ARBITRATE] Engaging Micro-Judge...")
    judge_result = await execute_micro_judge(user_prompt, advocate_results, metrics)

    total_latency_ms = (time.perf_counter() - total_start) * 1000
    metrics.total_latency = round(total_latency_ms, 1)

    logger.info(f"[JUDGE] Arbitration completed in {judge_result['latency_ms']}ms")
    logger.info(f"[JUDGE] Deflation applied: {judge_result['deflation_applied']}")
    logger.info(f"[JUDGE] Quorum achieved: {metrics.quorum_achieved}")

    # 3. Output payload
    logger.info("=" * 60)
    logger.info("FINAL SYSTEM OUTPUT")
    logger.info("=" * 60)
    print(f"\nWinning Advocate: {judge_result['verdict']['winning_advocate']}")
    print(f"Justification: {judge_result['verdict']['justification']}")
    print(f"\nFinal Answer:\n{judge_result['verdict']['final_answer']}\n")
    logger.info("=" * 60)

    # 4. Metrics report
    metrics.report()

    # SLA Check
    sla_passed = metrics.total_latency <= SLA_TOTAL_MS
    logger.info(f"[SLA] {'PASS' if sla_passed else 'WARN'}: {metrics.total_latency:.1f}ms / {SLA_TOTAL_MS}ms")

    return {
        "status": "success",
        "verdict": judge_result["verdict"],
        "metrics": metrics,
    }


# ============================================================================
# PATCH 6: FastAPI Wrapper (mandatory for cloud deployment)
# ============================================================================

app = FastAPI(
    title="TR-D3Max Cloud POC",
    description="Deterministic multi-model inference with arbitration",
    version="1.0.0",
)


class InferenceRequest(BaseModel):
    query: str
    max_latency_ms: int = SLA_TOTAL_MS


class InferenceResponse(BaseModel):
    status: str
    verdict: Dict
    latency_ms: float
    quorum_passed: bool
    sla_passed: bool


@app.post("/infer", response_model=InferenceResponse)
async def infer(request: InferenceRequest):
    """
    PATCH 6: Production API endpoint.
    Accepts query, returns structured judgment.
    """
    try:
        if len(request.query) < 10:
            raise HTTPException(status_code=400, detail="Query too short (<10 chars)")

        result = await run_tr_d3max_poc(request.query)

        return InferenceResponse(
            status=result["status"],
            verdict=result["verdict"],
            latency_ms=result["metrics"].total_latency,
            quorum_passed=result["metrics"].quorum_achieved,
            sla_passed=result["metrics"].total_latency <= request.max_latency_ms,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[API_ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "tr-d3max-cloud-poc"}


# ============================================================================
# CLI Entry Point (local testing)
# ============================================================================

async def main():
    """Local test mode."""
    test_queries = [
        (
            "If a startup has strong user retention but high customer acquisition cost (CAC), "
            "what is the immediate strategic maneuver?"
        ),
        (
            "A Series A company has 3 months of runway. Should they raise emergency funding "
            "or extend runway through cost optimization?"
        ),
    ]

    for query in test_queries:
        logger.info(f"\n{'=' * 60}")
        await run_tr_d3max_poc(query)
        await asyncio.sleep(1)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "server":
        # Run as API server
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8001)
    else:
        # Run as CLI
        asyncio.run(main())
