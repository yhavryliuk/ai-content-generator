"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { type LoginValues } from "../schemas/auth";
import { redirect } from "next/navigation";

export type SignInState = {
  success?: boolean;
  error?: string;
};

export async function signInWithPasswordAction(
  prevState: SignInState | null,
  payload: LoginValues
): Promise<SignInState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  redirect("/dashboard"); 
}