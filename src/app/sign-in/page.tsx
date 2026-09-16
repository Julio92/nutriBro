import { Leaf } from "lucide-react";
import { redirect } from "next/navigation";

import { CredentialsSignInForm } from "@/components/local-auth-forms";
import { getCurrentIdentity } from "@/server/auth/current-identity";
import {
  getMissingAuthenticationEnvironmentVariables,
  isAuthenticationConfigured,
} from "@/server/auth/auth-configuration";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const identity = await getCurrentIdentity();

  if (identity) {
    redirect("/");
  }

  const isConfigured = isAuthenticationConfigured();

  return (
    <main className="sign-in-page">
      <section className="sign-in-card" aria-labelledby="sign-in-title">
        <div className="sign-in-card__brand" aria-label="Nutribro">
          <span className="brand__mark" aria-hidden="true"><Leaf size={20} /></span>
          <span>nutriBro</span>
        </div>
        <p className="eyebrow">Tu espacio personal</p>
        <h1 id="sign-in-title">Organiza tu semana a tu ritmo.</h1>
        <p className="sign-in-card__description">
          Accede a tus recetas y a tu menú recurrente en un espacio privado.
        </p>

        {isConfigured ? (
          <CredentialsSignInForm />
        ) : (
          <div className="sign-in-card__setup" role="status">
            <strong>El acceso todavía no está configurado.</strong>
            <p>
              Añade estas variables de entorno para habilitarlo: {getMissingAuthenticationEnvironmentVariables().join(", ")}.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
