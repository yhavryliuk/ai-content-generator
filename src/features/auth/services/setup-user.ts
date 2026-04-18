'use server';

import { prisma } from "@/shared/lib/prisma";

export async function setupUser(userId: string, email: string) {
  return await prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: {
      id: userId,
      email,
    },
  });
}
