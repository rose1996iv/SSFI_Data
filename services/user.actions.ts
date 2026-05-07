"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserProfile } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";
import { userRoleSchema } from "@/lib/schemas";
import { logActivity } from "@/services/activity.service";
import { updateUserApproval, updateUserRole } from "@/services/user.service";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function approveUserAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageUsers(profile.role)) {
    throw new Error("You do not have permission to manage users.");
  }

  const userId = getString(formData, "user_id");
  const approve = getString(formData, "approve") === "true";

  await updateUserApproval(userId, approve);
  await logActivity({
    actor_user_id: profile.id,
    action: approve ? "user.approved" : "user.revoked",
    entity_type: "user",
    entity_id: userId,
  });

  revalidatePath("/admin");
}

export async function updateUserRoleAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageUsers(profile.role)) {
    throw new Error("You do not have permission to manage roles.");
  }

  const userId = getString(formData, "user_id");
  const parsed = userRoleSchema.parse({
    role: getString(formData, "role"),
  });

  await updateUserRole(userId, parsed.role);
  await logActivity({
    actor_user_id: profile.id,
    action: "user.role_updated",
    entity_type: "user",
    entity_id: userId,
    metadata: { role: parsed.role },
  });

  revalidatePath("/admin");
}
