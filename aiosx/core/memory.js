// Phase 9: Lightweight Memory System (local session persistence)

const STORAGE_KEY = "AIOSX_MEMORY";

export function getMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Memory load failed:", err);
    return {};
  }
}

export function saveMemory({ input, output }) {
  try {
    const current = getMemory();
    const history = current.history || [];

    history.push({ input, output, ts: Date.now() });

    const updated = {
      lastInput:  input,
      lastOutput: output,
      history:    history.slice(-20),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Memory save failed:", err);
  }
}

export function clearMemory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Memory clear failed:", err);
  }
}
