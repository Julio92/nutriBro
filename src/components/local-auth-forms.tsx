"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordRecoveryToken, resetPasswordWithToken } from "@/app/reset-password/actions";
import { signInWithCredentials } from "@/app/sign-in/actions";
import { registerLocalAccount } from "@/app/sign-up/actions";
import { requestEmailVerificationToken, verifyEmailToken } from "@/app/verify-email/actions";
import type { AuthFormState } from "@/domain/auth/types";

const initialState: AuthFormState = {};

export function CredentialsSignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    initialState,
  );

  return (
    <form className="auth-form" action={formAction} noValidate>
      <AuthFormMessage state={state} />
      <CredentialFields state={state} passwordAutoComplete="current-password" />
      <input name="redirectTo" type="hidden" value="/" />
      <button className="button button--primary sign-in-card__submit" type="submit" disabled={isPending}>
        {isPending ? "Accediendo…" : "Acceder"}
      </button>
      <p className="auth-form__footer">
        <Link href="/reset-password">He olvidado la contraseña</Link>
        <span> · </span>
        <Link href="/verify-email">Verificar correo</Link>
      </p>
      <p className="auth-form__footer">
        ¿Aún no tienes cuenta? <Link href="/sign-up">Crear una cuenta</Link>
      </p>
    </form>
  );
}

export function LocalAccountRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerLocalAccount,
    initialState,
  );
  const displayNameError = state.fields?.displayName?.[0];
  const passwordConfirmationError = state.fields?.passwordConfirmation?.[0];

  return (
    <form className="auth-form" action={formAction} noValidate>
      <AuthFormMessage state={state} />
      <label className="form-field form-field--wide" htmlFor="displayName">
        <span>Nombre</span>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          aria-describedby={displayNameError ? "displayName-error" : undefined}
          aria-invalid={Boolean(displayNameError)}
          required
        />
        <FieldError id="displayName-error" message={displayNameError} />
      </label>
      <CredentialFields state={state} passwordAutoComplete="new-password" />
      <label className="form-field form-field--wide" htmlFor="passwordConfirmation">
        <span>Repite la contraseña</span>
        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          aria-describedby={passwordConfirmationError ? "passwordConfirmation-error" : undefined}
          aria-invalid={Boolean(passwordConfirmationError)}
          required
        />
        <FieldError id="passwordConfirmation-error" message={passwordConfirmationError} />
      </label>
      <button className="button button--primary sign-in-card__submit" type="submit" disabled={isPending}>
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
      <p className="auth-form__footer">
        <Link href="/verify-email">Verificar mi correo</Link>
      </p>
      <p className="auth-form__footer">
        ¿Ya tienes cuenta? <Link href="/sign-in">Acceder</Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [requestState, requestAction, requestPending] = useActionState(
    requestPasswordRecoveryToken,
    {} as AuthFormState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetPasswordWithToken,
    {} as AuthFormState,
  );

  return (
    <>
      <form className="auth-form" action={requestAction} noValidate>
        <AuthFormMessage state={requestState} />
        <label className="form-field form-field--wide" htmlFor="reset-email">
          <span>Correo electrónico</span>
          <input id="reset-email" name="email" type="email" autoComplete="email" required />
        </label>
        <button className="button button--primary sign-in-card__submit" type="submit" disabled={requestPending}>
          {requestPending ? "Generando token…" : "Generar token de recuperación"}
        </button>
        <p className="auth-form__footer">
          <Link href="/sign-in">Volver a iniciar sesión</Link>
        </p>
      </form>

      {requestState.token ? (
        <div className="auth-form" aria-live="polite">
          <p className="form-success">Token generado.</p>
          <p>
            <strong>Token:</strong> <code>{requestState.token}</code>
          </p>
          <p>Usa este token y tu nueva contraseña en el formulario de abajo.</p>
        </div>
      ) : null}

      <form className="auth-form" action={resetAction} noValidate>
        <AuthFormMessage state={resetState} />
        <label className="form-field form-field--wide" htmlFor="reset-password-email">
          <span>Correo electrónico</span>
          <input id="reset-password-email" name="email" type="email" defaultValue={requestState.email ?? ""} autoComplete="email" required />
        </label>
        <label className="form-field form-field--wide" htmlFor="reset-password-token">
          <span>Token de recuperación</span>
          <input id="reset-password-token" name="token" type="text" defaultValue={requestState.token ?? ""} required />
        </label>
        <label className="form-field form-field--wide" htmlFor="reset-password-new">
          <span>Nueva contraseña</span>
          <input id="reset-password-new" name="password" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        <label className="form-field form-field--wide" htmlFor="reset-password-confirm">
          <span>Repite la contraseña</span>
          <input id="reset-password-confirm" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        <button className="button button--primary sign-in-card__submit" type="submit" disabled={resetPending}>
          {resetPending ? "Actualizando contraseña…" : "Cambiar contraseña"}
        </button>
        <p className="auth-form__footer">
          <Link href="/sign-in">Volver a iniciar sesión</Link>
        </p>
      </form>
    </>
  );
}

export function VerifyEmailForm() {
  const [requestState, requestAction, requestPending] = useActionState(
    requestEmailVerificationToken,
    {} as AuthFormState,
  );
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyEmailToken,
    {} as AuthFormState,
  );

  return (
    <>
      <form className="auth-form" action={requestAction} noValidate>
        <AuthFormMessage state={requestState} />
        <label className="form-field form-field--wide" htmlFor="verify-email-address">
          <span>Correo electrónico</span>
          <input id="verify-email-address" name="email" type="email" autoComplete="email" required />
        </label>
        <button className="button button--primary sign-in-card__submit" type="submit" disabled={requestPending}>
          {requestPending ? "Generando token…" : "Generar token de verificación"}
        </button>
        <p className="auth-form__footer">
          <Link href="/sign-in">Volver a iniciar sesión</Link>
        </p>
      </form>

      {requestState.token ? (
        <div className="auth-form" aria-live="polite">
          <p className="form-success">Token creado.</p>
          <p>
            <strong>Token:</strong> <code>{requestState.token}</code>
          </p>
          <p>Introduce este token en el formulario de abajo para confirmar tu correo.</p>
        </div>
      ) : null}

      <form className="auth-form" action={verifyAction} noValidate>
        <AuthFormMessage state={verifyState} />
        <label className="form-field form-field--wide" htmlFor="verify-email-email">
          <span>Correo electrónico</span>
          <input id="verify-email-email" name="email" type="email" defaultValue={requestState.email ?? ""} autoComplete="email" required />
        </label>
        <label className="form-field form-field--wide" htmlFor="verify-email-token">
          <span>Token de verificación</span>
          <input id="verify-email-token" name="token" type="text" defaultValue={requestState.token ?? ""} required />
        </label>
        <button className="button button--primary sign-in-card__submit" type="submit" disabled={verifyPending}>
          {verifyPending ? "Verificando…" : "Verificar correo"}
        </button>
        <p className="auth-form__footer">
          <Link href="/sign-in">Volver a iniciar sesión</Link>
        </p>
      </form>
    </>
  );
}

function CredentialFields({
  state,
  passwordAutoComplete,
}: {
  state: AuthFormState;
  passwordAutoComplete: "current-password" | "new-password";
}) {
  const emailError = state.fields?.email?.[0];
  const passwordError = state.fields?.password?.[0];

  return (
    <>
      <label className="form-field form-field--wide" htmlFor="email">
        <span>Correo electrónico</span>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          required
        />
        <FieldError id="email-error" message={emailError} />
      </label>
      <label className="form-field form-field--wide" htmlFor="password">
        <span>Contraseña</span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={passwordAutoComplete}
          minLength={12}
          aria-describedby={passwordError ? "password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          required
        />
        <small className="auth-form__hint">Al menos 12 caracteres.</small>
        <FieldError id="password-error" message={passwordError} />
      </label>
    </>
  );
}

function AuthFormMessage({ state }: { state: AuthFormState }) {
  if (state.error) {
    return (
      <p className="form-error" role="alert">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="form-success" role="status">
        {state.success}
      </p>
    );
  }

  return null;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <small id={id} className="auth-form__field-error" role="alert">
      {message}
    </small>
  ) : null;
}
