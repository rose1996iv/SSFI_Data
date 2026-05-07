"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserProfile } from "@/lib/auth";
import { updateDisplayNameSchema, updatePasswordSchema } from "@/lib/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/services/auth.actions";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

type UpdateResult = Promise<{ error: { message: string } | null }>;

export async function updateDisplayNameAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentUserProfile();

  const parsed = updateDisplayNameSchema.safeParse({
    display_name: getString(formData, "display_name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid display name." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await (supabase as never as {
    from: (table: string) => {
      update: (value: unknown) => {
        eq: (column: string, value: string) => UpdateResult;
      };
    };
  })
    .from("users")
    .update({ display_name: parsed.data.display_name })
    .eq("id", profile.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: "Display name updated successfully." };
}

export async function updatePasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: getString(formData, "password"),
    confirm_password: getString(formData, "confirm_password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully." };
}
