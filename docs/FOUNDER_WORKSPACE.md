# Founder Workspace

This document anchors the first integration seam for the conversational PlatFormula experience.

## Runtime flow

Conversation -> WorkItem -> delegated workers -> interactive artifacts -> authorization -> execution -> verification -> ThreadLocker receipt.

## Adapter seams

### Conversation / voice
Produces structured WorkItems while keeping the human-facing session alive.

### Resource worker
Consumes founder/company context and returns sourced ResourceRecords.

### Browser adapter
Returns a BrowserSession with viewer/control endpoints. Candidate implementations: Browser Use, CDP/noVNC, Vercel Computer Use, Browserbase.

### Build worker
Receives a WorkItem plus repository/context references and returns ArtifactRecords and execution evidence.

### Logic Lattice
Transitions consequential work from proposed to authorized.

### ThreadLocker
Receives final WorkItem, source IDs, artifacts, tool/execution evidence and verification results; persists manifest/ledger/commit receipts.

## Acceptance demonstration

1. Founder enters an objective.
2. WorkItem is created.
3. Resource candidates arrive with provenance.
4. BrowserSession displays a real candidate site.
5. Human can select a candidate and request comparison/build work.
6. Build worker produces a runnable artifact.
7. Verification produces PASS/PARTIAL/BLOCKED/FAIL.
8. ThreadLocker stores the receipt.
9. Another model can resume using external work state.
