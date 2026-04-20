"use server"

import { prisma } from "@/shared/lib/prisma";
import { cache } from "react";

export const getUserWithStats = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { 
      _count: { 
        select: { posts: true } 
      } 
    },
  });
});
