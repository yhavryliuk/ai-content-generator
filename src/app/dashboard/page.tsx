import { redirect } from "next/navigation";
import { GeneratorForm } from "@/features/generator/components/generator-form";
import { getCurrentUser } from "@/shared/services/get-current-user";
import { getUserWithStats } from "@/features/users/services/get-user-with-stats";

const FREE_POST_LIMIT = 3;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getUserWithStats(user.id);

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <GeneratorForm
      used={dbUser._count.posts}
      limit={FREE_POST_LIMIT}
      plan={dbUser.plan}
    />
  );
}
