import { describe, expect, it } from "vitest";

import {
  AuthenticationRequiredError,
  ForbiddenError,
} from "@/server/services/errors";

import { apiError, assertSameOrigin } from "./api-response";

describe("assertSameOrigin", () => {
  it("accepts localhost when the standalone runtime listens on 0.0.0.0", () => {
    const request = new Request("http://0.0.0.0:3000/api/recipes", {
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
      },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("uses trusted forwarding headers when a reverse proxy is present", () => {
    const request = new Request("http://127.0.0.1:3000/api/recipes", {
      headers: {
        host: "127.0.0.1:3000",
        origin: "https://nutribro.example",
        "x-forwarded-host": "nutribro.example",
        "x-forwarded-proto": "https",
      },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("rejects a cross-site origin", () => {
    const request = new Request("http://0.0.0.0:3000/api/recipes", {
      headers: {
        host: "localhost:3000",
        origin: "https://malicious.example",
      },
    });

    expect(() => assertSameOrigin(request)).toThrow(ForbiddenError);
  });
});

describe("apiError", () => {
  it("returns 401 for an unauthenticated request", async () => {
    const response = apiError(new AuthenticationRequiredError());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Debes iniciar sesión para acceder a tu espacio.",
      },
    });
  });
});