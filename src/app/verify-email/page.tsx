import { Leaf } from "lucide-react";
import { redirect } from "next/navigation";

import { VerifyEmailForm } from "@/components/local-auth-forms";
import { getCurrentIdentity } from "@/server/auth/current-identity";
import {
  getMissingAuthenticationEnvironmentVariables,
  isAuthenticationConfigured,
} from "@/server/auth/auth-configuration";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage() {
  const identity = await getCurrentIdentity();

  if (identity) {
    redirect("/");
  }

  const isConfigured = isAuthenticationConfigured();

  return (
    <main className="sign-in-page">
      <section className="sign-in-card" aria-labelledby="verify-email-title">
        <div className="sign-in-card__brand" aria-label="Nutribro">
          <span className="brand__mark" aria-hidden="true"><Leaf size={20} /></span>
          <span>nutriBro</span>
        </div>
        <p className="eyebrow">Verificación</p>
        <h1 id="verify-email-title">Confirma tu correo.</h1>
        <p className="sign-in-card__description">
          Genera un token de verificación y úsalo aquí para activar tu cuenta antes de acceder.
        </p>

        {isConfigured ? (
          <VerifyEmailForm />
        ) : (
          <div className="sign-in-card__setup" role="status">
            <strong>El acceso todavía no está configurado.</strong>
            <p>
              Añade estas variables de entorno para habilitarlo: {getMissingAuthenticationEnvironmentVariables().join(", ") }.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
