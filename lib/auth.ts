import { redirect } from "next/navigation";

import { dashboardLandingByRole, roleOptions } from "@/lib/constants/app";
import { env } from "@/lib/env";
import { demoUser } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "@/types/domain";

async function getUserRoleLabel(role: AppRole) {
  return roleOptions.find((option) => option.key === role)?.name || "Guest";
}

type UserRoleJoin = {
  id: string;
  email: string;
  display_name: string | null;
  member_id: string | null;
  is_approved: boolean;
  roles: {
    key: AppRole;
    name: string;
  } | null;
};

async function getProfileFromDatabase(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("users")
    .select("id, email, display_name, member_id, is_approved, roles(key, name)")
    .eq("id", userId)
    .maybeSingle();

  return (data as UserRoleJoin | null) || null;
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

  const dbProfile = await getProfileFromDatabase(user.id);
  const role = dbProfile?.roles?.key || (user.app_metadata.role as AppRole | undefined) || "guest";

  return {
    id: user.id,
    email: dbProfile?.email || user.email || "",
    display_name: dbProfile?.display_name || (user.user_metadata.full_name as string | undefined) || user.email || "Member",
    role,
    role_label: dbProfile?.roles?.name || (await getUserRoleLabel(role)),
    member_id: dbProfile?.member_id || (user.user_metadata.member_id as string | undefined) || null,
    is_approved: dbProfile?.is_approved ?? true,
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

  const dbProfile = await getProfileFromDatabase(user.id);
  const role = dbProfile?.roles?.key || (user.app_metadata.role as AppRole | undefined) || "guest";

  return {
    id: user.id,
    email: dbProfile?.email || user.email || "",
    display_name: dbProfile?.display_name || (user.user_metadata.full_name as string | undefined) || user.email || "Member",
    role,
    role_label: dbProfile?.roles?.name || (await getUserRoleLabel(role)),
    member_id: dbProfile?.member_id || (user.user_metadata.member_id as string | undefined) || null,
    is_approved: dbProfile?.is_approved ?? true,
  } satisfies UserProfile;
}

export async function getDashboardHomeForCurrentUser() {
  const profile = await getCurrentUserProfile();
  return dashboardLandingByRole[profile.role];
}
