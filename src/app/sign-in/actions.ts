"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import type { AuthFormState } from "@/domain/auth/types";

export async function signInWithCredentials(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  try {
    await signIn("credentials", formData);
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "El correo o la contraseña no son válidos.",
      };
    }

    throw error;
  }
}
