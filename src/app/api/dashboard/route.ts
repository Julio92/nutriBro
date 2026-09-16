import { requireCurrentIdentity } from "@/server/auth/current-identity";
import { apiError, apiSuccess } from "@/server/http/api-response";
import { nutritionService } from "@/server/services/nutrition-service-instance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const identity = await requireCurrentIdentity();
    return apiSuccess(await nutritionService.getDashboard(identity.userId));
  } catch (error) {
    return apiError(error);
  }
}
