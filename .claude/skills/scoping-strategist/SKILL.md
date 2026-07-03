---
name: scoping-strategist
description: Run this skill FIRST when a hackathon problem statement is pasted, before any code is written. Use whenever the user shares a problem statement, brief, challenge description, or says "yeh banana hai" / "problem statement aa gaya" / "let's start". Converts a raw problem statement into a scoped build plan with one core flow. NO CODE is allowed until this skill's output is approved by the human.
---

# Scoping Strategist (Phase 2 - First 60 Minutes)

## Hard rule
Do not write, scaffold, or generate any code in this phase. Output is a plan document only.

## Process

### Step 1 - Core Value Proposition (max 15 min)
From the problem statement, answer in 5 lines or less:
1. Who is the user? (one persona)
2. What is their #1 pain point?
3. What single feature solves it end-to-end?
4. What is the "golden path" demo journey? (login -> action -> result, one line)
5. What will judges see in 3 minutes?

### Step 2 - Ruthless cut list
List every feature the problem statement suggests, then mark:
- **BUILD** - only what the golden path needs (target: 1 core flow + 1 wow factor max)
- **FAKE** - hardcode/mock it (seed data, static screens)
- **SKIP** - say no, note it for the presentation as "future roadmap"

### Step 3 - Architecture map (before code)
Produce, in this order:
1. Data model - tables, columns, relations (plain text, no SQL yet)
2. API endpoints - method, path, purpose (one line each)
3. User state flow - page-by-page journey
4. Guardrails - which files/configs are frozen for this project

### Step 4 - Human approval gate
Present the plan as a single markdown block. End with:
"Approve karo toh Phase 3 (feature-slice-builder) start karta hoon. Modify?"
Wait for explicit approval. Do not proceed on silence.

## Output format
One markdown document, max ~60 lines. No prose paragraphs - headings and bullets only.
