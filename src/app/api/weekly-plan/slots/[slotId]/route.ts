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

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/weekly-plan/slots/[slotId]">,
) {
  try {
    assertSameOrigin(request);
    const { slotId } = await context.params;
    const body = await parseJsonBody(request);
    const identity = await requireCurrentIdentity();
    return apiSuccess(
      await nutritionService.setSlotRecipes(identity.userId, slotId, body),
    );
  } catch (error) {
    return apiError(error);
  }
}
