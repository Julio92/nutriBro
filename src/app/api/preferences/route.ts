import { requireCurrentIdentity } from "@/server/auth/current-identity";
import {
  apiError,
  apiSuccess,
  assertSameOrigin,
  parseJsonBody,
} from "@/server/http/api-response";
import { userPreferencesService } from "@/server/services/user-preferences-service-instance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await parseJsonBody(request);
    const identity = await requireCurrentIdentity();
    return apiSuccess(
      await userPreferencesService.savePreferences(identity.userId, body),
    );
  } catch (error) {
    return apiError(error);
  }
}
