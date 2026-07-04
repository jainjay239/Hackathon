# Cooking Todo Gemini Planner

A focused hackathon warm-up app that turns a user's daily routine into a practical one-day cooking plan. The app helps busy people decide what to cook, what to buy, what to substitute, and whether the plan fits their rough budget.

## What It Builds

- Breakfast, lunch, and dinner plan for one day
- Itemized grocery list with quantities and estimated costs
- Ingredient substitutions for unavailable or expensive items
- Budget feasibility analysis with saving tips

## GenAI Usage Disclosure

This app uses Google Gemini through the official `@google/genai` SDK. The Gemini call runs only on the server in `app/cooking-todo/actions.ts` through a Next.js server action.

The user-entered day description is sent to Gemini. Gemini must return strict JSON with exactly these top-level sections: `mealPlan`, `groceryList`, `substitutions`, and `budgetFeasibilityAnalysis`. If Gemini is unavailable, misconfigured, empty, or returns malformed JSON, the app shows a clear error and does not display fake output.

Environment variable required in `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
```

When the user does not specify budget or currency, the prompt defaults to Indian context, INR, and approximate Indian grocery price estimates.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/cooking-todo`.

## Verification

```bash
npm run lint
npm run build
```

Manual acceptance path:

1. Open `http://localhost:3000/cooking-todo`.
2. Enter a daily routine with preferences, constraints, ingredients, and optional budget.
3. Click `Generate plan`.
4. Confirm the loading state appears.
5. Confirm four sections render: meal plan, grocery list, substitutions, budget feasibility.
6. If budget is not provided, confirm the result uses INR and approximate Indian grocery costs.
7. If Gemini fails, confirm a clear error appears and no fake result is shown.

## Scope Boundaries

- No database or persistence
- No login or demo credentials
- No external pricing APIs
- No mock AI responses
- No multi-day calendar
