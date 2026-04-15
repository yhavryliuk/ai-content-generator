import { createClient } from "@/shared/lib/supabase/server";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import { GeneratorForm } from "@/features/generator/components/generator-form";

const FREE_POST_LIMIT = 3;

export default async function DashboardPage() {
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
    <GeneratorForm
      used={dbUser._count.posts}
      limit={FREE_POST_LIMIT}
      plan={dbUser.plan}
    />
  );
}
