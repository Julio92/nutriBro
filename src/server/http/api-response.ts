import "server-only";

import type { ApiFailure, ApiSuccess } from "@/domain/nutrition/types";
import { AppError, ForbiddenError, ValidationError } from "@/server/services/errors";

const MAX_BODY_SIZE = 60_000;

const apiHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

export function apiSuccess<T>(data: T, status = 200) {
  const body: ApiSuccess<T> = { data };

  return Response.json(body, {
    status,
    headers: apiHeaders,
  });
}

export function apiError(error: unknown) {
  if (error instanceof AppError) {
    const body: ApiFailure = {
      error: {
        code: error.code,
        message: error.message,
        ...(error.fields ? { fields: error.fields } : {}),
      },
    };

    return Response.json(body, {
      status: error.status,
      headers: apiHeaders,
    });
  }

  console.error("Unexpected API error", error);

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "No se ha podido completar la operación. Inténtalo de nuevo.",
      },
    },
    {
      status: 500,
      headers: apiHeaders,
    },
  );
}

function firstHeaderValue(request: Request, headerName: string) {
  return request.headers.get(headerName)?.split(",")[0]?.trim();
}

function getPublicRequestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const host =
    firstHeaderValue(request, "x-forwarded-host") ||
    request.headers.get("host") ||
    requestUrl.host;
  const protocol =
    firstHeaderValue(request, "x-forwarded-proto") ||
    requestUrl.protocol.replace(/:$/, "");

  return `${protocol}://${host}`;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return;
  }

  let normalizedOrigin: string;
  try {
    normalizedOrigin = new URL(origin).origin;
  } catch {
    throw new ForbiddenError("El origen de la solicitud no es válido.");
  }

  if (normalizedOrigin !== getPublicRequestOrigin(request)) {
    throw new ForbiddenError("La solicitud no procede de este sitio.");
  }
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ValidationError("El contenido de la solicitud debe ser JSON.");
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
    throw new ValidationError("La solicitud es demasiado grande.");
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_SIZE) {
    throw new ValidationError("La solicitud es demasiado grande.");
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new ValidationError("El JSON enviado no es válido.");
  }
}
