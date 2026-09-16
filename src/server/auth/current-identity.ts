import "server-only";

import { auth } from "@/auth";
import { isAuthenticationConfigured } from "@/server/auth/auth-configuration";
import {
  AuthenticationRequiredError,
  ConfigurationError,
} from "@/server/services/errors";

export interface CurrentIdentity {
  userId: string;
  role: "owner";
  displayName: string;
  email: string | null;
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  if (!isAuthenticationConfigured()) {
    return null;
  }

  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return null;
  }

  const displayName = (
    user.name?.trim() || user.email?.split("@")[0] || "Tu espacio"
  ).slice(0, 120);

  return {
    userId: user.id,
    role: "owner",
    displayName,
    email: user.email ?? null,
  };
}

export async function requireCurrentIdentity(): Promise<CurrentIdentity> {
  if (!isAuthenticationConfigured()) {
    throw new ConfigurationError("La autenticación todavía no está configurada.");
  }

  const identity = await getCurrentIdentity();

  if (!identity) {
    throw new AuthenticationRequiredError();
  }

  return identity;
}
