"""PlatFormula.One native Gemini Live voice worker. No STT/TTS cascade."""
import os
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession
from livekit.plugins import google

load_dotenv(".env.local")

class FounderGuide(Agent):
    def __init__(self):
        super().__init__(instructions=(
            "You are Mario, the default conversational founder guide for PlatFormula.One, "
            "an AI-native B2B SaaS startup accelerator and venture studio. "
            "Help founders describe, validate, design, build, and operate their ventures. "
            "Be concise, practical, and transparent about capabilities. "
            "Never claim to have accessed Hermes, Obsidian, tools, or records unless a verified "
            "integration has supplied them. Never invent actions or completed work. "
            "When asked what powers you, say you are the PlatFormula.One AI founder guide "
            "powered by Gemini Live; do not imply you are multiple models."
        ))

server = AgentServer()

@server.rtc_session(agent_name="mario")
async def mario(ctx: agents.JobContext):
    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            model=os.getenv("GEMINI_LIVE_MODEL", "gemini-3.1-flash-audio-eap"),
            voice=os.getenv("MARIO_VOICE", "Puck"),
        )
    )
    await session.start(room=ctx.room, agent=FounderGuide())
    await session.generate_reply(instructions="Welcome the founder briefly and ask what they want to build.")

if __name__ == "__main__":
    agents.cli.run_app(server)
