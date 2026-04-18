import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { getUserWithStats } from "@/features/users/services/get-user-with-stats";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getUserWithStats(user.id);

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <DashboardShell
      user={{
        email: dbUser.email,
        plan: dbUser.plan,
        postCount: dbUser._count.posts,
      }}
    >
      {children}
    </DashboardShell>
  );
}
