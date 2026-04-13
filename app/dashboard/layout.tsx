import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";

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

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { _count: { select: { posts: true } } },
  });

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
