"use server";

import { GoogleGenAI, Type, type Schema } from "@google/genai";
import type { CookingPlan, CookingPlanActionState } from "./types";

const REQUIRED_TOP_LEVEL_KEYS = [
  "mealPlan",
  "groceryList",
  "substitutions",
  "budgetFeasibilityAnalysis",
];

const cookingPlanSchema: Schema = {
  type: Type.OBJECT,
  required: REQUIRED_TOP_LEVEL_KEYS,
  propertyOrdering: REQUIRED_TOP_LEVEL_KEYS,
  properties: {
    mealPlan: {
      type: Type.OBJECT,
      required: ["breakfast", "lunch", "dinner"],
      propertyOrdering: ["breakfast", "lunch", "dinner"],
      properties: {
        breakfast: { type: Type.STRING },
        lunch: { type: Type.STRING },
        dinner: { type: Type.STRING },
      },
    },
    groceryList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["item", "quantity", "estimatedCost", "reason"],
        propertyOrdering: ["item", "quantity", "estimatedCost", "reason"],
        properties: {
          item: { type: Type.STRING },
          quantity: { type: Type.STRING },
          estimatedCost: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
      },
    },
    substitutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["original", "substitute", "why"],
        propertyOrdering: ["original", "substitute", "why"],
        properties: {
          original: { type: Type.STRING },
          substitute: { type: Type.STRING },
          why: { type: Type.STRING },
        },
      },
    },
    budgetFeasibilityAnalysis: {
      type: Type.OBJECT,
      required: ["summary", "estimatedTotal", "feasibility", "budgetTips"],
      propertyOrdering: ["summary", "estimatedTotal", "feasibility", "budgetTips"],
      properties: {
        summary: { type: Type.STRING },
        estimatedTotal: { type: Type.STRING },
        feasibility: { type: Type.STRING },
        budgetTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
  },
};

function readDayDescription(formData: FormData) {
  const value = formData.get("dayDescription");

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyTopLevelKeys(value: Record<string, unknown>) {
  const keys = Object.keys(value).sort();
  const expectedKeys = [...REQUIRED_TOP_LEVEL_KEYS].sort();

  return keys.length === expectedKeys.length && keys.every((key, index) => key === expectedKeys[index]);
}

function isMealPlan(value: unknown) {
  return (
    isStringRecord(value) &&
    typeof value.breakfast === "string" &&
    typeof value.lunch === "string" &&
    typeof value.dinner === "string"
  );
}

function isGroceryList(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isStringRecord(item) &&
        typeof item.item === "string" &&
        typeof item.quantity === "string" &&
        typeof item.estimatedCost === "string" &&
        typeof item.reason === "string",
    )
  );
}

function isSubstitutions(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isStringRecord(item) &&
        typeof item.original === "string" &&
        typeof item.substitute === "string" &&
        typeof item.why === "string",
    )
  );
}

function isBudgetAnalysis(value: unknown) {
  return (
    isStringRecord(value) &&
    typeof value.summary === "string" &&
    typeof value.estimatedTotal === "string" &&
    typeof value.feasibility === "string" &&
    Array.isArray(value.budgetTips) &&
    value.budgetTips.every((tip) => typeof tip === "string")
  );
}

function parseCookingPlan(rawText: string): CookingPlan {
  const parsed: unknown = JSON.parse(rawText);

  if (!isStringRecord(parsed) || !hasOnlyTopLevelKeys(parsed)) {
    throw new Error("Gemini returned an unexpected response shape.");
  }

  if (
    !isMealPlan(parsed.mealPlan) ||
    !isGroceryList(parsed.groceryList) ||
    !isSubstitutions(parsed.substitutions) ||
    !isBudgetAnalysis(parsed.budgetFeasibilityAnalysis)
  ) {
    throw new Error("Gemini returned incomplete meal planning details.");
  }

  return parsed as CookingPlan;
}

export async function generateCookingPlan(
  _previousState: CookingPlanActionState,
  formData: FormData,
): Promise<CookingPlanActionState> {
  const dayDescription = readDayDescription(formData);

  if (dayDescription.length < 20) {
    return {
      status: "error",
      error: "Please describe your day, food preferences, constraints, and rough budget in at least 20 characters.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      status: "error",
      error: "Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the server.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a practical one-day cooking plan from this user routine. Use realistic household grocery quantities and budget reasoning. Do not include medical, dietary, or nutrition claims. Respect any budget or currency the user provides. If the user does not specify budget or currency, default to Indian context with INR, use the rupee symbol, and estimate using approximate Indian grocery prices. Always state that costs are approximate. User routine: ${dayDescription}`,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: cookingPlanSchema,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    return {
      status: "success",
      data: parseCookingPlan(responseText),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error.";

    return {
      status: "error",
      error: `Could not generate the cooking plan. ${message}`,
    };
  }
}

export const initialCookingPlanState: CookingPlanActionState = { status: "idle" };
