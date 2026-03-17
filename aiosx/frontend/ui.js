// Phase 10: UI Controller (connects input → kernel → graph → output)

import { runAIOSX } from "../core/kernel.js";

const inputBox   = document.getElementById("user-input");
const runBtn     = document.getElementById("run-btn");
const micBtn     = document.getElementById("mic-btn");
const outputPanel = document.getElementById("output-panel");

// speech recognition (optional but aligned with voice-first design)
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous     = false;
  recognition.interimResults = false;
  recognition.lang           = "en-US";

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    if (inputBox) inputBox.value = text;
    execute(text);
  };
}

async function execute(text) {
  const query = (text ?? (inputBox ? inputBox.value : "")).trim();
  if (!query) return;

  setLoading(true);

  try {
    const result = await runAIOSX({ input: query });
    renderOutput(result);
  } catch (err) {
    renderOutput({ error: err.message });
  }

  setLoading(false);
}

function renderOutput(result) {
  if (!outputPanel) return;

  if (result.error) {
    outputPanel.innerHTML = `<div class="error">${result.error}</div>`;
    return;
  }

  const joyce = result.voice?.joyce || "";
  const gpt   = result.voice?.gpt   || "";
  const plan  = Array.isArray(result.plan) ? result.plan.join(" → ") : "";
  const body  = result.output || "";

  outputPanel.innerHTML = `
    <div class="voice-block">
      <div><strong>Joyce:</strong> ${joyce}</div>
      <div><strong>GPT:</strong> ${gpt}</div>
    </div>
    ${plan ? `<div class="plan-block"><strong>Plan:</strong> ${plan}</div>` : ""}
    <div class="result-block">
      <pre>${body}</pre>
    </div>
  `;
}

function setLoading(state) {
  if (runBtn) {
    runBtn.disabled  = state;
    runBtn.innerText = state ? "Running..." : "Run";
  }
}

if (runBtn) runBtn.addEventListener("click", () => execute());

if (inputBox) {
  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      execute();
    }
  });
}

if (micBtn && recognition) {
  micBtn.addEventListener("click", () => recognition.start());
}

window.AIOSX_UI = { execute };
