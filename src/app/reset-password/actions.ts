"use server";

import type { AuthFormState } from "@/domain/auth/types";
import { localAccountService } from "@/server/services/local-account-service-instance";

export async function requestPasswordRecoveryToken(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Introduce tu correo electrónico." };
  }

  const token = await localAccountService.requestPasswordRecovery({ email });

  if (!token) {
    return {
      error: "No existe ninguna cuenta con ese correo electrónico.",
      email,
    };
  }

  return {
    success: `Token generado para ${email}. Copia este token y úsalo en el formulario de cambio de contraseña.`,
    email,
    token,
  };
}

export async function resetPasswordWithToken(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

  if (!email || !token || !password) {
    return {
      error: "Faltan datos para cambiar la contraseña.",
      email,
      token,
    };
  }

  if (password !== passwordConfirmation) {
    return {
      error: "Las contraseñas no coinciden.",
      email,
      token,
    };
  }

  try {
    const account = await localAccountService.recoverPassword({
      email,
      token,
      password,
    });

    if (!account) {
      return {
        error: "El token es inválido o ha caducado. Genera uno nuevo para continuar.",
        email,
        token,
      };
    }

    return {
      success: `Contraseña actualizada correctamente para ${account.email}. Ya puedes iniciar sesión con la nueva contraseña.`,
      email: account.email,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
        email,
        token,
      };
    }

    return {
      error: "No se pudo actualizar la contraseña.",
      email,
      token,
    };
  }
}
