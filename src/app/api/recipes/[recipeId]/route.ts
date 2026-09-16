import { requireCurrentIdentity } from "@/server/auth/current-identity";
import {
  apiError,
  apiSuccess,
  assertSameOrigin,
  parseJsonBody,
} from "@/server/http/api-response";
import { nutritionService } from "@/server/services/nutrition-service-instance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/recipes/[recipeId]">,
) {
  try {
    const { recipeId } = await context.params;
    const identity = await requireCurrentIdentity();
    return apiSuccess(await nutritionService.getRecipe(identity.userId, recipeId));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/recipes/[recipeId]">,
) {
  try {
    assertSameOrigin(request);
    const { recipeId } = await context.params;
    const body = await parseJsonBody(request);
    const identity = await requireCurrentIdentity();
    return apiSuccess(
      await nutritionService.updateRecipe(identity.userId, recipeId, body),
    );
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/recipes/[recipeId]">,
) {
  try {
    assertSameOrigin(request);
    const { recipeId } = await context.params;
    const identity = await requireCurrentIdentity();
    return apiSuccess(await nutritionService.deleteRecipe(identity.userId, recipeId));
  } catch (error) {
    return apiError(error);
  }
}
