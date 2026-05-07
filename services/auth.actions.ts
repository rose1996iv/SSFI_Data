"use server";

import { redirect } from "next/navigation";

import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema, loginSchema } from "@/lib/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export type ActionState = {
  error?: string;
  success?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signInAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!payload.success) {
    return { error: payload.error.issues[0]?.message || "Invalid credentials." };
  }

  if (!env.isSupabaseConfigured) {
    redirect("/dashboard");
  }

  const rateLimit = checkRateLimit(`login:${payload.data.email}`);
  if (!rateLimit.allowed) {
    return { error: "Too many attempts. Please wait a minute before trying again." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword(payload.data);
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function requestPasswordResetAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = forgotPasswordSchema.safeParse({
    email: getString(formData, "email"),
  });

  if (!payload.success) {
    return { error: payload.error.issues[0]?.message || "Enter a valid email." };
  }

  if (!env.isSupabaseConfigured) {
    return { success: "Demo mode enabled. Connect Supabase to send real reset emails." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(payload.data.email, {
    redirectTo: `${env.siteUrl}/login`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset instructions have been sent to your email." };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/login");
}
