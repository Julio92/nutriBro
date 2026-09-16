"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import type { AuthFormState } from "@/domain/auth/types";
import { AppError } from "@/server/services/errors";
import { localAccountService } from "@/server/services/local-account-service-instance";

export async function registerLocalAccount(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const password = formData.get("password");
  const passwordConfirmation = formData.get("passwordConfirmation");

  if (
    typeof password !== "string" ||
    typeof passwordConfirmation !== "string" ||
    password !== passwordConfirmation
  ) {
    return {
      error: "Revisa los campos marcados para crear tu cuenta.",
      fields: {
        passwordConfirmation: ["Las contraseñas no coinciden."],
      },
    };
  }

  try {
    const account = await localAccountService.register({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password,
    });

    const credentials = new FormData();
    credentials.set("email", account.email);
    credentials.set("password", password);
    credentials.set("redirectTo", "/");
    await signIn("credentials", credentials);
    return {};
  } catch (error) {
    if (error instanceof AppError) {
      return {
        error: error.message,
        ...(error.fields ? { fields: error.fields } : {}),
      };
    }

    if (error instanceof AuthError) {
      return {
        error: "La cuenta se ha creado, pero no se ha podido iniciar sesión.",
      };
    }

    throw error;
  }
}
