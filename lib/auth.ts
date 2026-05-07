import { redirect } from "next/navigation";

import { dashboardLandingByRole, roleOptions } from "@/lib/constants/app";
import { env } from "@/lib/env";
import { demoUser } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "@/types/domain";

async function getUserRoleLabel(role: AppRole) {
  return roleOptions.find((option) => option.key === role)?.name || "Guest";
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  if (!env.isSupabaseConfigured) {
    return demoUser;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return demoUser;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = (user.app_metadata.role as AppRole | undefined) || "guest";

  return {
    id: user.id,
    email: user.email || "",
    display_name: (user.user_metadata.full_name as string | undefined) || user.email || "Member",
    role,
    role_label: await getUserRoleLabel(role),
    member_id: (user.user_metadata.member_id as string | undefined) || null,
  };
}

export async function getOptionalUserProfile() {
  if (!env.isSupabaseConfigured) {
    return demoUser;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const role = (user.app_metadata.role as AppRole | undefined) || "guest";

  return {
    id: user.id,
    email: user.email || "",
    display_name: (user.user_metadata.full_name as string | undefined) || user.email || "Member",
    role,
    role_label: await getUserRoleLabel(role),
    member_id: (user.user_metadata.member_id as string | undefined) || null,
  } satisfies UserProfile;
}

export async function getDashboardHomeForCurrentUser() {
  const profile = await getCurrentUserProfile();
  return dashboardLandingByRole[profile.role];
}
