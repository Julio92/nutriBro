import { describe, expect, it } from "vitest";

import {
  localAccountRegistrationSchema,
  localAccountSignInSchema,
} from "./schemas";

describe("local account schemas", () => {
  it("normalizes a valid email for sign-in", () => {
    const result = localAccountSignInSchema.parse({
      email: "  PERSONA@EXAMPLE.COM ",
      password: "una-contraseña-segura",
    });

    expect(result.email).toBe("persona@example.com");
  });

  it("requires a sufficiently long password when registering", () => {
    const result = localAccountRegistrationSchema.safeParse({
      displayName: "Ada",
      email: "ada@example.com",
      password: "corta123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["password"]);
    }
  });

  it("rejects unexpected registration fields", () => {
    const result = localAccountRegistrationSchema.safeParse({
      displayName: "Ada",
      email: "ada@example.com",
      password: "una-contraseña-segura",
      role: "admin",
    });

    expect(result.success).toBe(false);
  });
});
