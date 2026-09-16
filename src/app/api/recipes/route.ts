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

export async function GET() {
  try {
    const identity = await requireCurrentIdentity();
    return apiSuccess(await nutritionService.listRecipes(identity.userId));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await parseJsonBody(request);
    const identity = await requireCurrentIdentity();
    const recipe = await nutritionService.createRecipe(identity.userId, body);
    return apiSuccess(recipe, 201);
  } catch (error) {
    return apiError(error);
  }
}
