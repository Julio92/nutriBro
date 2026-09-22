import { Leaf } from "lucide-react";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/local-auth-forms";
import { getCurrentIdentity } from "@/server/auth/current-identity";
import {
  getMissingAuthenticationEnvironmentVariables,
  isAuthenticationConfigured,
} from "@/server/auth/auth-configuration";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const identity = await getCurrentIdentity();

  if (identity) {
    redirect("/");
  }

  const isConfigured = isAuthenticationConfigured();

  return (
    <main className="sign-in-page">
      <section className="sign-in-card" aria-labelledby="reset-password-title">
        <div className="sign-in-card__brand" aria-label="Nutribro">
          <span className="brand__mark" aria-hidden="true"><Leaf size={20} /></span>
          <span>nutriBro</span>
        </div>
        <p className="eyebrow">Recuperar acceso</p>
        <h1 id="reset-password-title">Restablece tu contraseña.</h1>
        <p className="sign-in-card__description">
          Genera un token de recuperación, copia el valor que se muestre aquí y usa la nueva contraseña en el formulario de abajo.
        </p>

        {isConfigured ? (
          <ResetPasswordForm />
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
