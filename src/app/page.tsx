import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getCurrentIdentity } from "@/server/auth/current-identity";
import { nutritionService } from "@/server/services/nutrition-service-instance";
import { userPreferencesService } from "@/server/services/user-preferences-service-instance";

export const dynamic = "force-dynamic";

export default async function Home() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const [dashboard, mealVisibility] = await Promise.all([
    nutritionService.getDashboard(identity.userId),
    userPreferencesService.getPreferences(identity.userId),
  ]);

  return (
    <AppShell
      initialData={dashboard}
      initialMealVisibility={mealVisibility}
      identity={identity}
    />
  );
}
