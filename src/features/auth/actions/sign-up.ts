"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { type RegisterValues } from "../schemas/auth";
import { redirect } from "next/navigation";
import { setupUser } from "../services/setup-user";

export type SignUpState = {
	success?: boolean;
	error?: string;
};

export async function signUpAction(
	prevState: SignUpState | null,
	payload: RegisterValues
): Promise<SignUpState> {
	const supabase = await createClient();

	const { data, error: signUpError } = await supabase.auth.signUp({
		email: payload.email,
		password: payload.password,
	});

	if (signUpError) {
		return { error: signUpError.message, success: false };
	}

	if (data.user) {
		await setupUser(data.user.id, data.user.email!);
	}


	redirect("/dashboard");
}