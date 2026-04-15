"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const FREE_POST_LIMIT = 3;

export async function validateGeneration() {
  'use server';
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", canGenerate: false } as const;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return { error: "User not found", canGenerate: false } as const;
  }

  if (dbUser.plan === "PRO") {
    return { canGenerate: true, used: 0, limit: Infinity } as const;
  }

  const postCount = await prisma.post.count({
    where: { authorId: user.id },
  });

  if (postCount >= FREE_POST_LIMIT) {
    return {
      error: "upgrade_required",
      canGenerate: false,
      used: postCount,
      limit: FREE_POST_LIMIT,
    } as const;
  }

  return {
    canGenerate: true,
    used: postCount,
    limit: FREE_POST_LIMIT,
  } as const;
}
