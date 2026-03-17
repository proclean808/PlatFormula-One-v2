// Phase 4: Dual-Agent Voice System (Joyce → GPT sequential playback)

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

function pickVoice(preferName) {
  if (!synth) return null;

  const target = (preferName || "").toLowerCase();
  let voices = synth.getVoices() || [];

  if (!voices.length) {
    synth.onvoiceschanged = () => {};
    voices = synth.getVoices() || [];
  }

  if (!voices.length) return null;

  let match = voices.find((v) => v.name.toLowerCase().includes(target));
  if (!match) match = voices.find((v) => v.lang === "en-US") || voices[0];

  return match || null;
}

// enforce ≤12 words
function trimTo12Words(text) {
  return String(text || "").trim().split(/\s+/).slice(0, 12).join(" ");
}

function generateJoyceLine(input) {
  const snippet = String(input || "").slice(0, 48);
  const base = snippet
    ? `Let's explore: ${snippet}`
    : "Waiting for a mission, ready to explore.";
  return trimTo12Words(base);
}

function generateGPTLine() {
  return trimTo12Words(
    "Recommended path: process input, route, execute, return result."
  );
}

function speak(text, voiceName, rate = 1, pitch = 1) {
  return new Promise((resolve) => {
    if (!synth) return resolve();

    const utter  = new SpeechSynthesisUtterance(text);
    const voice  = pickVoice(voiceName);
    if (voice) utter.voice = voice;
    utter.rate   = rate;
    utter.pitch  = pitch;
    utter.onend  = resolve;
    utter.onerror = resolve;

    synth.speak(utter);
  });
}

export async function playVoicePair(inputSummary) {
  const joyceLine = generateJoyceLine(inputSummary);
  const gptLine   = generateGPTLine();

  if (!synth) {
    if (window.AIOSX_VOICE_UI) {
      window.AIOSX_VOICE_UI.setJoyce(joyceLine);
      window.AIOSX_VOICE_UI.setGPT(gptLine);
    }
    return { joyce: joyceLine, gpt: gptLine };
  }

  synth.cancel();

  if (window.AIOSX_VOICE_UI) window.AIOSX_VOICE_UI.setJoyce(joyceLine);
  await speak(joyceLine, "female", 1.02, 1.1);

  await new Promise((r) => setTimeout(r, 160));

  if (window.AIOSX_VOICE_UI) window.AIOSX_VOICE_UI.setGPT(gptLine);
  await speak(gptLine, "male", 0.98, 0.95);

  return { joyce: joyceLine, gpt: gptLine };
}
