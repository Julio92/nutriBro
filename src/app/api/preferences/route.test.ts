import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireCurrentIdentityMock, savePreferencesMock } = vi.hoisted(() => ({
  requireCurrentIdentityMock: vi.fn(),
  savePreferencesMock: vi.fn(),
}));

vi.mock("@/server/auth/current-identity", () => ({
  requireCurrentIdentity: requireCurrentIdentityMock,
}));

vi.mock("@/server/services/user-preferences-service-instance", () => ({
  userPreferencesService: { savePreferences: savePreferencesMock },
}));

import { AuthenticationRequiredError, ValidationError } from "@/server/services/errors";
import { PATCH } from "./route";

const identity = {
  userId: "00000000-0000-4000-8000-000000000001",
  role: "owner" as const,
  displayName: "Ada",
  email: "ada@example.com",
};
const preferences = {
  breakfast: false,
  midMorning: true,
  lunch: false,
  snack: true,
  dinner: false,
};

function request(body: unknown) {
  return new Request("http://localhost/api/preferences", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify(body),
  });
}

describe("PATCH /api/preferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireCurrentIdentityMock.mockResolvedValue(identity);
    savePreferencesMock.mockResolvedValue(preferences);
  });

  it("saves the complete payload for the authenticated user", async () => {
    const response = await PATCH(request(preferences));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: preferences });
    expect(savePreferencesMock).toHaveBeenCalledWith(identity.userId, preferences);
  });

  it("rejects unauthenticated requests", async () => {
    requireCurrentIdentityMock.mockRejectedValue(new AuthenticationRequiredError());

    const response = await PATCH(request(preferences));

    expect(response.status).toBe(401);
    expect(savePreferencesMock).not.toHaveBeenCalled();
  });

  it("checks request origin before calling the service", async () => {
    const badOriginRequest = new Request("http://localhost/api/preferences", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        origin: "https://attacker.example",
      },
      body: JSON.stringify(preferences),
    });

    const response = await PATCH(badOriginRequest);

    expect(response.status).toBe(403);
    expect(requireCurrentIdentityMock).not.toHaveBeenCalled();
    expect(savePreferencesMock).not.toHaveBeenCalled();
  });

  it("rejects a client-selected owner field", async () => {
    const bodyWithUserId = { ...preferences, userId: "00000000-0000-4000-8000-000000000099" };
    savePreferencesMock.mockRejectedValue(
      new ValidationError("Revisa la configuración de visibilidad de las comidas."),
    );

    const response = await PATCH(request(bodyWithUserId));

    expect(response.status).toBe(400);
    expect(savePreferencesMock).toHaveBeenCalledWith(identity.userId, bodyWithUserId);
  });
});
