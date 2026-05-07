"use server";

import { redirect } from "next/navigation";

import { dashboardLandingByRole } from "@/lib/constants/app";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema, loginSchema } from "@/lib/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { AppRole } from "@/types/domain";
import type { Provider } from "@supabase/supabase-js";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: dbUser } = (await (supabase as never as {
    from: (table: string) => {
      select: (query: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { is_approved: boolean; roles: { key?: AppRole } | null } | null }>;
        };
      };
    };
  })
    .from("users")
    .select("is_approved, roles(key)")
    .eq("id", user?.id || "")
    .maybeSingle()) as {
    data: { is_approved: boolean; roles: { key?: AppRole } | null } | null;
  };

  if (dbUser && !dbUser.is_approved) {
    await supabase.auth.signOut();
    return { error: "Your account exists but is still waiting for admin approval." };
  }

  const role = ((dbUser?.roles as { key?: AppRole } | null)?.key || "guest") as AppRole;
  redirect(dashboardLandingByRole[role] || "/dashboard");
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

export async function signInWithOAuthAction(provider: Provider): Promise<ActionState> {
  if (!env.isSupabaseConfigured) {
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${env.siteUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Failed to initiate Google sign-in." };
}
