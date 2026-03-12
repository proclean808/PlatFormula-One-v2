"""
HomeService AI Pipeline — OnePath-equivalent vertical built on Factory.ai infrastructure.

Architecture:
    Inbound Lead (any channel)
         ↓
    QualifierDroid  ← NLP scoring, territory check, tier assignment
         ↓
    HVACIntakeDroid ← structured data extraction, job record creation
         ↓
    DispatchDroid   ← technician assignment, schedule optimization
         ↓
    FollowUpDroid   ← nurture sequence for unbooked / confirmation for booked

This demonstrates Factory.ai acting as agent OS infrastructure hosting
a complete vertical AI application as a plugin pack.
"""

import ray
import time
import uuid
from pathlib import Path
from typing import Optional

# Factory.ai infrastructure layer
from factory_ai import DroidFactory, RouterDroid, route_task

SKILLS_DIR = Path(__file__).parent.parent / "skills"


class HomeServicePipeline:
    """
    Vertical AI orchestration pipeline for home-service contractors.
    Replaces the traditional CSR (Customer Service Rep) intake layer.

    Lead capture → Qualification → Intake → Dispatch → Follow-Up
    """

    def __init__(self, ray_address: Optional[str] = None):
        if not ray.is_initialized():
            if ray_address:
                ray.init(address=ray_address, ignore_reinit_error=True)
            else:
                ray.init(ignore_reinit_error=True)

        self.factory = DroidFactory(ray_address=ray_address)
        self._droids: dict = {}
        self._pipeline_log: list = []

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def boot(self, use_gpu: bool = False):
        """Spawn all four home-service droids from YAML manifests."""
        skills = [
            "qualifier_droid.yaml",
            "hvac_intake.yaml",
            "dispatch_droid.yaml",
            "followup_droid.yaml",
        ]
        for skill_file in skills:
            path = SKILLS_DIR / skill_file
            droid = self.factory.create_droid(
                str(path),
                num_cpus=0.5,
                num_gpus=0.25 if use_gpu else 0.0,
            )
            manifest = self.factory.load_manifest(str(path))
            self._droids[manifest.name] = droid
            # Enable persistent memory on each droid
            try:
                ray.get(droid.enable_memory.remote())
            except Exception:
                pass
        print(f"[HomeService] Booted {len(self._droids)} droids: {list(self._droids.keys())}")

    def shutdown(self):
        for name in list(self._droids.keys()):
            self.factory.kill_droid(name)
        self._droids.clear()

    # ------------------------------------------------------------------
    # Pipeline entry point
    # ------------------------------------------------------------------

    def process_lead(
        self,
        raw_input: str,
        channel: str = "website",
        contact: Optional[str] = None,
        address: Optional[str] = None,
    ) -> dict:
        """
        Run a raw inbound lead through the full pipeline.

        Returns a combined result dict with outputs from each stage.
        """
        lead_id = str(uuid.uuid4())[:8]
        pipeline_result = {
            "lead_id": lead_id,
            "channel": channel,
            "raw_input": raw_input,
            "stages": {},
            "final_action": None,
            "created_at": time.time(),
        }

        # ── Stage 1: Qualification ────────────────────────────────────
        qual_prompt = (
            f"Channel: {channel}\n"
            f"Raw lead input: {raw_input}\n"
            f"Contact: {contact or 'unknown'}\n"
            f"Address: {address or 'unknown'}\n\n"
            "Qualify this lead and return the JSON record."
        )
        qual_result = self._run_stage("QualifierDroid", qual_prompt, lead_id, "qualification")
        pipeline_result["stages"]["qualification"] = qual_result

        # Short-circuit disqualified leads
        if self._extract_field(qual_result, "recommended_action") == "disqualify":
            pipeline_result["final_action"] = "disqualified"
            return pipeline_result

        # ── Stage 2: Intake (structured extraction) ───────────────────
        intake_prompt = (
            f"Lead ID: {lead_id}\n"
            f"Channel: {channel}\n"
            f"Qualification score: {self._extract_field(qual_result, 'qualification_score')}\n"
            f"Job type: {self._extract_field(qual_result, 'job_type')}\n"
            f"Customer input: {raw_input}\n"
            f"Contact: {contact or 'unknown'}\n"
            f"Address: {address or 'unknown'}\n\n"
            "Extract the structured HVAC lead record."
        )
        intake_result = self._run_stage("HVACIntakeDroid", intake_prompt, lead_id, "intake")
        pipeline_result["stages"]["intake"] = intake_result

        # ── Stage 3: Dispatch ─────────────────────────────────────────
        dispatch_prompt = (
            f"Lead ID: {lead_id}\n"
            f"Urgency: {self._extract_field(intake_result, 'urgency')}\n"
            f"System type: {self._extract_field(intake_result, 'system_type')}\n"
            f"Address: {address or self._extract_field(intake_result, 'address')}\n"
            f"Lead score: {self._extract_field(qual_result, 'tier')}\n\n"
            "Query technician availability and produce a dispatch order."
        )
        dispatch_result = self._run_stage("DispatchDroid", dispatch_prompt, lead_id, "dispatch")
        pipeline_result["stages"]["dispatch"] = dispatch_result

        # ── Stage 4: Follow-Up scheduling ─────────────────────────────
        followup_prompt = (
            f"Lead ID: {lead_id}\n"
            f"Lead score: {self._extract_field(qual_result, 'tier')}\n"
            f"System type: {self._extract_field(intake_result, 'system_type')}\n"
            f"Booking status: {'booked' if dispatch_result.get('output') else 'unbooked'}\n"
            f"Contact: {contact or 'unknown'}\n\n"
            "Generate the T+0h follow-up message (sequence_step: t0)."
        )
        followup_result = self._run_stage("FollowUpDroid", followup_prompt, lead_id, "followup")
        pipeline_result["stages"]["followup"] = followup_result

        pipeline_result["final_action"] = (
            "booked" if dispatch_result.get("output") else "nurture"
        )
        self._pipeline_log.append(pipeline_result)
        return pipeline_result

    # ------------------------------------------------------------------
    # Parallel multi-channel ingestion
    # ------------------------------------------------------------------

    def batch_ingest(self, leads: list[dict]) -> list[dict]:
        """
        Process multiple leads in parallel using Ray remote tasks.
        Each lead dict: {"raw_input": str, "channel": str, "contact": str, "address": str}
        """
        futures = []
        for lead in leads:
            # Stage 1 in parallel: qualification only (fan-out)
            droid = self._droids.get("QualifierDroid")
            if droid:
                prompt = (
                    f"Channel: {lead.get('channel', 'unknown')}\n"
                    f"Raw lead: {lead.get('raw_input', '')}\n"
                    "Qualify and return JSON."
                )
                futures.append(droid.run_task.remote(prompt))

        results = ray.get(futures)
        return [{"lead": leads[i], "qualification": results[i]} for i in range(len(results))]

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _run_stage(self, droid_name: str, prompt: str, lead_id: str, stage: str) -> dict:
        droid = self._droids.get(droid_name)
        if not droid:
            return {"error": f"{droid_name} not spawned", "stage": stage}
        try:
            result = ray.get(droid.run_task.remote(prompt))
            result["_lead_id"] = lead_id
            result["_stage"] = stage
            return result
        except Exception as e:
            return {"error": str(e), "stage": stage, "_lead_id": lead_id}

    @staticmethod
    def _extract_field(result: dict, field: str, default="unknown"):
        """Best-effort extraction from LLM output dict."""
        # Try direct key first
        if field in result:
            return result[field]
        # Try parsing from "output" string
        output = result.get("output", "")
        import re
        pattern = rf'"{field}"\s*:\s*"?([^",\n}}]+)"?'
        m = re.search(pattern, output)
        return m.group(1).strip() if m else default

    def get_pipeline_stats(self) -> dict:
        total = len(self._pipeline_log)
        if total == 0:
            return {"total": 0}
        booked = sum(1 for r in self._pipeline_log if r["final_action"] == "booked")
        disqualified = sum(1 for r in self._pipeline_log if r["final_action"] == "disqualified")
        nurture = total - booked - disqualified
        return {
            "total_leads": total,
            "booked": booked,
            "nurture": nurture,
            "disqualified": disqualified,
            "book_rate": round(booked / total * 100, 1),
            "disqualify_rate": round(disqualified / total * 100, 1),
        }

    def status(self) -> dict:
        return {
            "droids": list(self._droids.keys()),
            "droid_count": len(self._droids),
            "pipeline_stats": self.get_pipeline_stats(),
        }
