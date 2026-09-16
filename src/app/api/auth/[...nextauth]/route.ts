import { NextResponse, type NextRequest } from "next/server";

import { handlers } from "@/auth";
import {
  getMissingAuthenticationEnvironmentVariables,
  isAuthenticationConfigured,
} from "@/server/auth/auth-configuration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unavailableResponse() {
  return NextResponse.json(
    {
      error: {
        code: "AUTH_CONFIGURATION_REQUIRED",
        message: `Configura ${getMissingAuthenticationEnvironmentVariables().join(", ")} para habilitar el acceso.`,
      },
    },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthenticationConfigured()) {
    return unavailableResponse();
  }

  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticationConfigured()) {
    return unavailableResponse();
  }

  return handlers.POST(request);
}
