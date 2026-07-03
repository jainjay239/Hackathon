---
name: error-fix-protocol
description: Use this skill the moment ANY error, bug, crash, failed build, red terminal output, or "not working" / "error aa raha hai" / "fix this" message appears. Enforces token-cheap debugging - minimal context in, diff-only out, and a hard stop after 3 failed attempts.
---

# Error Fix Protocol

## Intake - demand minimal context, not the whole project
Ask for (or extract) ONLY:
1. Exact error message (copy-paste)
2. The file + ~20 lines around the failing point
3. What was expected vs what happened (one line)
Do NOT request or re-read the full codebase.

## Fix procedure
1. State the root cause in ONE line before fixing. No essays.
2. Output the fix as a diff or the single changed file only.
3. Give one verification step.

## The 3-attempt circuit breaker (hard rule)
- Attempt 1 fails -> try a different hypothesis, say what changed in thinking.
- Attempt 2 fails -> stop patching. Re-read the actual file(s) fresh, check
  assumptions (versions, env vars, imports).
- Attempt 3 fails -> STOP. Output:
  - "3 attempts done. Recommendation: revert to last commit
    (`git checkout -- <file>` or `git reset --hard HEAD`) and re-slice smaller."
  - List the 2-3 most likely root causes for human decision.
Never enter attempt 4 silently. This prevents token-burning death spirals.

## Negative constraints
- No refactoring while fixing. Fix the bug, nothing else.
- No adding new libraries to "solve" a bug without approval.
- No console.log carpet-bombing - max 2 targeted logs if needed, remove after.

## Common hackathon culprits - check these FIRST
1. Missing/typo in `.env.local` var (restart dev server after change)
2. Server vs client component mismatch ("use client" missing)
3. Supabase RLS blocking the query (check policies before blaming code)
4. Stale node_modules after package change (`rm -rf .next && npm run dev`)
