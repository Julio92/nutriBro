import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getCurrentIdentity } from "@/server/auth/current-identity";
import { nutritionService } from "@/server/services/nutrition-service-instance";

export const dynamic = "force-dynamic";

export default async function Home() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const dashboard = await nutritionService.getDashboard(identity.userId);

  return <AppShell initialData={dashboard} identity={identity} />;
}
