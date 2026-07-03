---
name: demo-doc-generator
description: Use this skill in the final hour of the hackathon, or whenever the user says "demo prep", "documentation banao", "README", "presentation", "submission", or "1 hour left". Generates submission-grade docs from the finished repo and locks the golden path demo. Also use for judge-facing pitch content.
---

# Demo & Doc Generator (Phase 5 - Final Hour)

## Timeline discipline
- T-60 min: start this skill. Feature freeze warning.
- T-30 min: CODE LOCK. No new code, only docs and demo rehearsal.

## 1. README.md (generate from actual repo, not memory)
Read the real file tree and package.json first. Then produce:
- Project name + one-line pitch (problem -> solution)
- 3-step setup: clone, env vars needed (names only, no values), `npm run dev`
- Architecture: data model summary + API endpoint table (method | path | purpose)
- Tech stack list
- "Future roadmap" - paste the SKIP list from scoping-strategist here
Max 80 lines. Judges skim, they do not read.

## 2. Golden Path demo script
Write the exact click-by-click journey (numbered, max 10 steps):
- Which URL to open, what to click, what to type, what the judge sees
- Mark the "wow moment" step explicitly
- Rule: only demo what was rehearsed. NO live improvisation paths.

## 3. Pitch skeleton (90 seconds)
- 15s: problem (who hurts, how much)
- 15s: solution one-liner
- 45s: live golden path demo
- 15s: tech credibility (stack + one hard thing solved) + roadmap

## 4. Asset checklist
Remind the human to capture:
- [ ] Screenshot of each golden-path screen
- [ ] Architecture diagram (offer to generate Mermaid)
- [ ] Repo pushed, README rendered correctly on GitHub

## Negative constraints
- Do not invent features in docs that do not exist in code.
- Do not suggest last-minute "quick wins" after code lock. Answer: "Roadmap me daal do."
