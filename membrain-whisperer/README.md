# MemBrain Whisperer

**PlatFormula.ONE** — Live VC Pitch Co-Pilot for Samsung Galaxy S25 Ultra + Galaxy Watch 7

MemBrain Whisperer is a covert Android intelligence module that listens to live investor meetings, generates real-time data-point insights via Gemini 2.5 Flash, and pushes 5-word HUD prompts to a paired Galaxy Watch 7 — all secured behind a biometric dead-man's switch.

---

## Features

- **Live audio capture** — 16 kHz PCM mono stream from the device microphone
- **Gemini 2.5 Flash (RAG)** — Real-time insight generation with pre-injected company context (CAC, LTV, valuation, payback period)
- **Wearable Data Layer bridge** — Covert 5-word HUD pushes delivered to the Watch 7 over BLE with urgent dispatch and haptic trigger
- **Zero-Trust dead-man's switch** — Watch must send a biometric pulse every 5 seconds; missed pulse immediately severs audio capture and clears the transcript
- **Full dark-mode Compose UI** — `#0A0A0A` background, `#00FF00` primary accent
- **Secure API key injection** — `GEMINI_API_KEY` is read from `local.properties` via `BuildConfig`; never hardcoded

---

## Target Hardware

| Device | Role |
|--------|------|
| Samsung Galaxy S25 Ultra | Engine — audio capture + Gemini inference |
| Samsung Galaxy Watch 7 | Covert HUD — displays insight + fires haptic |

Minimum Android SDK: **30** (Android 11), required for Wearable Data Layer.

---

## Architecture

```
Microphone (16 kHz PCM)
        │
        ▼
Gemini 2.5 Flash ──── RAG context (CAC / LTV / Valuation)
        │
        ▼  BLE / Wearable Data Layer
Galaxy Watch 7 HUD (5-word insight + haptic)

        ↕  Dead-man's switch
Watch pulse < 5 s  ──▶  capture active
Watch pulse ≥ 5 s  ──▶  capture severed, transcript cleared
```

---

## Setup

### 1. Prerequisites

- Android Studio Ladybug (2024.2) or newer
- Android SDK 35
- A Google AI Studio API key — <https://aistudio.google.com/app/apikey>

### 2. Clone and open the module

```bash
# Open membrain-whisperer/ as the root project in Android Studio
cd membrain-whisperer
```

### 3. Configure secrets

Copy the example properties file and fill in your values:

```bash
cp local.properties.example local.properties
```

Edit `local.properties`:

```properties
sdk.dir=/path/to/your/Android/sdk
GEMINI_API_KEY=your_gemini_api_key_here
```

> **`local.properties` is git-ignored and must never be committed.**

### 4. Build and run

```bash
./gradlew :app:assembleDebug
```

Or press **▶ Run** in Android Studio targeting a connected S25 Ultra or emulator (API 30+).

---

## Project Structure

```
membrain-whisperer/
├── app/
│   ├── build.gradle.kts          # Dependencies & BuildConfig injection
│   ├── proguard-rules.pro        # Keep rules for Wearable + Gemini SDK
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   ├── java/…/MemBrainWhisperer.kt   # Activity + Compose UI
│       │   └── res/                           # Icons, strings, themes
│       └── test/
│           └── java/…/MemBrainWhispererTest.kt
├── gradle/
│   ├── libs.versions.toml        # Version catalog
│   └── wrapper/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── local.properties.example      # Template — copy to local.properties
└── preview.html                  # Static UI preview (open in any browser)
```

---

## Running Tests

```bash
./gradlew :app:test
```

Four unit tests cover:

1. Dead-man's switch: stale timestamp (≥ 5 s) → disconnected
2. Dead-man's switch: fresh timestamp (< 5 s) → connected
3. Insight trimming: whitespace stripped from Gemini response
4. Listening fallback: `null` response defaults to `"LISTENING"`

---

## UI Preview

Open `preview.html` in any browser for a static mock of all three app states (hardware disconnected, biometric locked + ready, live co-pilot active) plus the Galaxy Watch 7 HUD.

---

## Security Notes

- The `GEMINI_API_KEY` is injected at build time via `BuildConfig` from `local.properties` — it is **never** present in source control.
- Audio capture is gated behind Android `RECORD_AUDIO` runtime permission.
- Recording is disabled entirely when the wearable biometric pulse is absent.
- ProGuard is enabled for release builds.
