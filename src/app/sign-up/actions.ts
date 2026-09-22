"use server";

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

    const verificationToken = await localAccountService.requestEmailVerification({
      email: account.email,
    });

    if (!verificationToken) {
      return {
        error: "La cuenta se ha creado, pero no se pudo generar el token de verificación.",
      };
    }

    return {
      success: `Cuenta creada. Verifica tu correo antes de iniciar sesión. Usa este token en la página de verificación: ${verificationToken}`,
      email: account.email,
      token: verificationToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        error: error.message,
        ...(error.fields ? { fields: error.fields } : {}),
      };
    }

    throw error;
  }
}
