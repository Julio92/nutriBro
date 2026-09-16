import type {
  ApiFailure,
  ApiSuccess,
  DashboardData,
  RecipeDetail,
  RecipeInput,
} from "@/domain/nutrition/types";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload || "error" in payload) {
    const failure = payload && "error" in payload ? payload.error : null;
    throw new ApiClientError(
      failure?.message ?? "No se ha podido completar la operación.",
      response.status,
      failure?.fields,
    );
  }

  return payload.data;
}

export const nutritionApi = {
  getDashboard: () => request<DashboardData>("/api/dashboard"),
  getRecipe: (recipeId: string) =>
    request<RecipeDetail>(`/api/recipes/${encodeURIComponent(recipeId)}`),
  createRecipe: (input: RecipeInput) =>
    request<RecipeDetail>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateRecipe: (recipeId: string, input: RecipeInput) =>
    request<RecipeDetail>(`/api/recipes/${encodeURIComponent(recipeId)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteRecipe: (recipeId: string) =>
    request<{ deletedRecipeId: string; clearedAssignments: number }>(
      `/api/recipes/${encodeURIComponent(recipeId)}`,
      { method: "DELETE" },
    ),
  setSlotRecipes: (slotId: string, recipeIds: string[]) =>
    request<DashboardData>(
      `/api/weekly-plan/slots/${encodeURIComponent(slotId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ recipeIds }),
      },
    ),
};
