'use server';

import { prisma } from "../lib/prisma";

export async function findUser(userId: string) {
	const dbUser = await prisma.user.findUnique({
		where: { id: userId },
	});
	return dbUser;
}