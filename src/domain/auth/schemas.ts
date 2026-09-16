import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .max(320, "El correo electrónico es demasiado largo.")
  .email("Introduce un correo electrónico válido.")
  .transform((value) => value.toLocaleLowerCase("en-US"));

const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(128, "La contraseña no puede superar los 128 caracteres.");

export const localAccountSignInSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const localAccountRegistrationSchema = localAccountSignInSchema.extend({
  displayName: z
    .string()
    .trim()
    .min(1, "Indica cómo quieres que te llamemos.")
    .max(120, "El nombre no puede superar los 120 caracteres."),
});

export function fieldErrorsFromAuthSchema(error: z.ZodError) {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    fields[field] ??= [];
    fields[field].push(issue.message);
  }

  return fields;
}
