---
name: hackathon-context
description: Project rule book for the hackathon build. ALWAYS consult this skill at the start of every session and before writing or modifying ANY code, creating files, choosing libraries, or structuring folders. Also use when deciding what NOT to touch. This is the single source of truth for stack, conventions, and guardrails.
---

# Hackathon Context (Rule Book)

## Stack (fixed - do not substitute)
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Supabase (auth + Postgres + RLS) if backend needed
- Deploy target: Vercel

## Folder conventions
```
app/            - routes only, thin pages
components/     - reusable UI (PascalCase files)
components/ui/  - shadcn primitives (NEVER edit these)
lib/            - utilities, supabase client, helpers
types/          - shared TypeScript types
```

## Coding rules
- TypeScript strict. No `any` unless impossible otherwise.
- No code comments in generated code. Code must be self-explanatory.
- Server components by default; `"use client"` only when interactivity needed.
- All Supabase tables MUST have RLS policies before use.
- No hardcoded secrets. Env vars only, via `.env.local`.
- Use "-" hyphen only, never em-dash, in all text/copy.

## GUARDRAILS - never touch without explicit human approval
- `components/ui/*` (shadcn primitives)
- `.env.local`, `next.config.js`, `tailwind.config.ts`
- Any file already committed and working, unless the task names it

## Output rules (token economy)
- When editing: show only the diff or changed file, not the whole project.
- No explanations unless asked. Code first.
- If ambiguous: ask ONE clarifying question, do not guess.

## Update log
<!-- skill-ops-manager appends approved changes here -->
