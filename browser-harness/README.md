# PlatFormula.One — browser harness

This is a **real remote Chrome runtime**, not an iframe of gemini.google.com or chatgpt.com. Each service runs an isolated, persistent browser profile with Selkies video, keyboard/touch, speaker output and browser-to-session microphone forwarding. The homepage embeds the *Selkies viewer*, not the provider site.

## Start (Linux Docker host, not Vercel static hosting)

1. Set the following in a private `browser-harness/.env` (never commit): `JOYCE_BROWSER_USER`, `JOYCE_BROWSER_PASSWORD`, `COUNCIL_BROWSER_USER`, `COUNCIL_BROWSER_PASSWORD`, `PF1_PORTAL_ORIGIN=https://<your-portal-host>`.
2. Run `docker compose --env-file browser-harness/.env -f browser-harness/compose.yaml up -d` on an authorized Linux Docker host.
3. Services bind **only** to 127.0.0.1:3101 and :3102. Terminate TLS and enforce strong authentication/authorization on separate HTTPS subdomains or authenticated proxy paths. Forward WebSockets and allow the portal origin in frame policy. Do not expose raw container ports publicly. Never expose a shared authenticated personal Google session to untrusted site visitors.
4. Set Vite build variables `VITE_JOYCE_STREAM_URL=https://<secured-joyce-host>` and `VITE_COUNCIL_STREAM_URL=https://<secured-council-host>`, then build/deploy the existing site. No browser panels appear until configured.
5. Sign into each provider manually in its own Chrome session. Enable the Selkies microphone button, grant Chrome microphone permission, and test speaker output and interactive navigation.

## Product limitations and acceptance

- This setup carries **native website interaction and audio**, without provider APIs or a separate STT/TTS pipeline. It does not grant ChatGPT, Gemini or joYCe any autonomous permissions or cross-agent coordination.
- Google's documentation says **Gemini Live in the Gemini web app is not available**; Gemini Live in **Chrome** is a separate, gradually released capability and may not be enabled for the account or this Linux Chrome runtime. Do not advertise joYCe native Gemini voice as working until verified in the deployed session.
- A Chromium remote desktop is not itself a headless automation agent. This implementation intentionally keeps a visible browser for authenticated native voice interaction.
- Acceptance: (1) secure login to remote stream, (2) interactive Chrome rendering, (3) local mic forwarded into Chrome, (4) remote audio reaches user, (5) native provider conversational voice demonstrated end-to-end, (6) isolated profiles across both sessions, (7) no unauthenticated access. Mark any failed gate BLOCKED, not shipped.
- Container runs with a persistent profile; use separate per-founder instances and an identity-aware gateway before allowing public visitors. The container has privileged desktop capabilities; read upstream hardening guidance.
- No Vercel deployment or browser runtime is created by committing this code.

References: https://docs.linuxserver.io/images/docker-chrome/ and https://docs.linuxserver.io/selkies/user-guide/web-client/ and https://support.google.com/gemini/answer/16363185 and https://support.google.com/gemini/answer/15274899
