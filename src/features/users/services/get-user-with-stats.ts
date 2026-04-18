"use server"

import { prisma } from "@/shared/lib/prisma";

export async function getUserWithStats(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { 
      _count: { 
        select: { posts: true } 
      } 
    },
  });
}
