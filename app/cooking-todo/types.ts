export type MealPlan = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type GroceryItem = {
  item: string;
  quantity: string;
  estimatedCost: string;
  reason: string;
};

export type IngredientSubstitution = {
  original: string;
  substitute: string;
  why: string;
};

export type BudgetFeasibilityAnalysis = {
  summary: string;
  estimatedTotal: string;
  feasibility: string;
  budgetTips: string[];
};

export type CookingPlan = {
  mealPlan: MealPlan;
  groceryList: GroceryItem[];
  substitutions: IngredientSubstitution[];
  budgetFeasibilityAnalysis: BudgetFeasibilityAnalysis;
};

export type CookingPlanActionState =
  | { status: "idle"; data?: undefined; error?: undefined }
  | { status: "success"; data: CookingPlan; error?: undefined }
  | { status: "error"; data?: undefined; error: string };
