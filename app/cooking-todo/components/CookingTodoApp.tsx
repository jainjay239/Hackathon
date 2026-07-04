"use client";

import { useActionState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateCookingPlan, initialCookingPlanState } from "../actions";
import type { CookingPlan } from "../types";

function MealPlanSection({ mealPlan }: { mealPlan: CookingPlan["mealPlan"] }) {
  const meals = [
    ["Breakfast", mealPlan.breakfast],
    ["Lunch", mealPlan.lunch],
    ["Dinner", mealPlan.dinner],
  ];

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Meal plan</CardTitle>
        <CardDescription>Three practical meals matched to the day you described.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {meals.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GroceryListSection({ groceryList }: { groceryList: CookingPlan["groceryList"] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Grocery list</CardTitle>
        <CardDescription>Items to buy with estimated quantities and costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-600">
                <th className="py-2 pr-4 font-medium">Item</th>
                <th className="py-2 pr-4 font-medium">Quantity</th>
                <th className="py-2 pr-4 font-medium">Cost</th>
                <th className="py-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={`${item.item}-${index}`} className="border-b border-zinc-100 last:border-0">
                  <td className="py-3 pr-4 align-top font-medium text-zinc-950">{item.item}</td>
                  <td className="py-3 pr-4 align-top text-zinc-700">{item.quantity}</td>
                  <td className="py-3 pr-4 align-top text-zinc-700">{item.estimatedCost}</td>
                  <td className="py-3 align-top text-zinc-700">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SubstitutionsSection({ substitutions }: { substitutions: CookingPlan["substitutions"] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Ingredient substitutions</CardTitle>
        <CardDescription>Flexible swaps if an ingredient is unavailable or expensive.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {substitutions.map((item, index) => (
          <div key={`${item.original}-${index}`} className="rounded-lg border border-zinc-200 p-4">
            <div className="text-sm font-semibold text-zinc-950">
              {item.original} to {item.substitute}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{item.why}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BudgetSection({ budget }: { budget: CookingPlan["budgetFeasibilityAnalysis"] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Budget feasibility</CardTitle>
        <CardDescription>Approximate cost view and practical saving tips.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold text-zinc-950">Estimated total</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{budget.estimatedTotal}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold text-zinc-950">Feasibility</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{budget.feasibility}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-zinc-700">{budget.summary}</p>
        <ul className="grid gap-2 text-sm leading-6 text-zinc-700 sm:grid-cols-2">
          {budget.budgetTips.map((tip, index) => (
            <li key={`${tip}-${index}`} className="rounded-lg border border-zinc-200 px-3 py-2">
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ResultSections({ plan }: { plan: CookingPlan }) {
  return (
    <section aria-live="polite" className="space-y-5">
      <MealPlanSection mealPlan={plan.mealPlan} />
      <GroceryListSection groceryList={plan.groceryList} />
      <SubstitutionsSection substitutions={plan.substitutions} />
      <BudgetSection budget={plan.budgetFeasibilityAnalysis} />
    </section>
  );
}

export function CookingTodoApp() {
  const [state, formAction, isPending] = useActionState(generateCookingPlan, initialCookingPlanState);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Cooking Todo
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
              Plan today&apos;s meals from your routine
            </h1>
            <p className="text-base leading-7 text-zinc-700">
              Describe your day, food preferences, ingredients, time limits, and rough budget. Gemini will return a one-day meal plan, grocery list, substitutions, and budget feasibility.
            </p>
          </div>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Generate a plan</CardTitle>
              <CardDescription>No response is mocked. If Gemini is unavailable, you will see an error.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dayDescription" className="text-sm font-medium text-zinc-950">
                    Describe your day
                  </label>
                  <textarea
                    id="dayDescription"
                    name="dayDescription"
                    minLength={20}
                    required
                    rows={8}
                    className="w-full resize-y rounded-lg border border-input bg-white px-3 py-2 text-base leading-6 text-zinc-950 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
                    placeholder="Example: I leave for office at 9, return by 7, prefer vegetarian food, have rice and dal at home, want to keep the day under 350 rupees."
                    disabled={isPending}
                  />
                  <p className="text-sm leading-6 text-zinc-600">
                    Include schedule, preferences, dietary constraints, ingredients you already have, and budget if you know it.
                  </p>
                </div>

                <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
                  {isPending ? (
                    <>
                      <Loader2 aria-hidden="true" className="animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      <Sparkles aria-hidden="true" />
                      Generate plan
                    </>
                  )}
                </Button>

                {state.status === "error" ? (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                    {state.error}
                  </div>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </section>

        {state.status === "success" ? <ResultSections plan={state.data} /> : null}
      </div>
    </main>
  );
}
