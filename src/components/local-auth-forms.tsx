"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInWithCredentials } from "@/app/sign-in/actions";
import { registerLocalAccount } from "@/app/sign-up/actions";
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
        ¿Ya tienes cuenta? <Link href="/sign-in">Acceder</Link>
      </p>
    </form>
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
  return state.error ? (
    <p className="form-error" role="alert">
      {state.error}
    </p>
  ) : null;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <small id={id} className="auth-form__field-error" role="alert">
      {message}
    </small>
  ) : null;
}
