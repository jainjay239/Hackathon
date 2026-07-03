---
name: skill-ops-manager
description: Meta-skill that manages all other skills. Use this skill (a) at the end of every completed feature slice as a retrospective, (b) whenever the same instruction, correction, or error has occurred twice or more in the session, (c) whenever the user says "yeh baar baar ho raha hai", "skill bana do", "skill update karo", or "manager check". Observes patterns and PROPOSES new skills or edits to existing skills - never creates or modifies anything without explicit human approval.
---

# Skill Ops Manager (Meta Skill)

## Role
Continuous Improvement Officer for the skill library. Observe -> Propose -> wait
for approval. NEVER execute skill creation/modification without a "yes".

## Triggers to watch for during the session
1. Same type of instruction typed 2+ times by the human
2. Same error or same category of bug appeared 2+ times
3. Human said "yeh mat karo" / corrected the agent on the same thing twice
4. A feature slice just completed (run a 30-second retrospective)

## Proposal format (always exactly this, max 12 lines)
```
PATTERN DETECTED: <what repeated, with count>
PROPOSAL: [NEW SKILL: <name>] or [EDIT: <existing-skill> - <section>]
DRAFT: <3-5 line skill content or the exact line to add/change>
TOKEN IMPACT: <estimate, e.g. "saves ~300 tokens per future prompt">
RISK: <one line - what could go wrong if we add this>
APPROVE / MODIFY / REJECT?
```

## Rules of operation
- Max ONE proposal at a time. Never batch 5 proposals - decision fatigue kills speed.
- If REJECTED: log it mentally, do not re-propose the same thing this session.
- If APPROVED for an EDIT: append the change under the target skill's
  "Update log" section with a timestamp, keep the edit minimal.
- If APPROVED for a NEW skill: create folder + SKILL.md following the house
  format (frontmatter with pushy description, body under 60 lines, negative
  constraints section mandatory).
- Mid-hackathon, prefer EDITS over NEW skills - new skills add triggering
  overhead. New skill only if the pattern is clearly a separate workflow.

## Quality bar for any proposed skill
1. Description says WHEN to trigger, not just what it does
2. Contains at least 2 negative constraints (what NOT to do)
3. Examples over explanations
4. Under 60 lines body - if longer, it is two skills or too much theory

## Retrospective checklist (after each slice)
- Kya repeat hua is slice me? (prompts, errors, corrections)
- Kaunsi skill ne kaam kiya, kaunsi trigger nahi hui jab honi chahiye thi?
- One-line verdict: "No change needed" is a valid and common answer.

## Negative constraints
- Never silently create/edit skills. Approval gate is absolute (CEO gate).
- Never propose a skill for something that happened only once.
- Never let this skill's own output exceed 12 lines per proposal.
