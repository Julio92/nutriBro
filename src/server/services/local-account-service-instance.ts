import "server-only";

import { PostgresLocalAccountRepository } from "@/server/infrastructure/postgres-local-account-repository";

import { LocalAccountService } from "./local-account-service";

export const localAccountService = new LocalAccountService(
  new PostgresLocalAccountRepository(),
);
