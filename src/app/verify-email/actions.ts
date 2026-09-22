"use server";

import type { AuthFormState } from "@/domain/auth/types";
import { localAccountService } from "@/server/services/local-account-service-instance";

export async function requestEmailVerificationToken(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Introduce tu correo electrónico." };
  }

  const token = await localAccountService.requestEmailVerification({ email });

  if (!token) {
    return {
      error: "No existe ninguna cuenta con ese correo electrónico.",
      email,
    };
  }

  return {
    success: `Token de verificación generado para ${email}. Copia este token y úsalo para confirmar tu correo.`,
    email,
    token,
  };
}

export async function verifyEmailToken(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();

  if (!email || !token) {
    return {
      error: "Faltan datos para verificar el correo.",
      email,
      token,
    };
  }

  const account = await localAccountService.verifyEmail({ email, token });

  if (!account) {
    return {
      error: "El token es inválido o ha caducado. Genera uno nuevo para continuar.",
      email,
      token,
    };
  }

  return {
    success: `Correo verificado correctamente para ${account.email}. Ya puedes iniciar sesión.`,
    email: account.email,
  };
}
