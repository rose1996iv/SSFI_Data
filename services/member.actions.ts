"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserProfile } from "@/lib/auth";
import { canManageLeadership, canManageMembers } from "@/lib/permissions";
import { graduateSchema, leadershipSchema, memberSchema } from "@/lib/schemas";
import { createGraduateRecord } from "@/services/graduate.service";
import { createLeadershipRecord } from "@/services/leadership.service";
import { logActivity } from "@/services/activity.service";
import { createMember, deleteMember, updateMember, uploadMemberImage } from "@/services/member.service";

function nullableString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createMemberAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    throw new Error("You do not have permission to create members.");
  }

  const payload = memberSchema.parse({
    full_name: requiredString(formData, "full_name"),
    email: requiredString(formData, "email"),
    gender: nullableString(formData, "gender"),
    date_of_birth: nullableString(formData, "date_of_birth"),
    phone_number: nullableString(formData, "phone_number"),
    whatsapp: nullableString(formData, "whatsapp"),
    telegram: nullableString(formData, "telegram"),
    village_in_myanmar: nullableString(formData, "village_in_myanmar"),
    current_city_in_india: nullableString(formData, "current_city_in_india"),
    state_in_india: nullableString(formData, "state_in_india"),
    university: nullableString(formData, "university"),
    major: nullableString(formData, "major"),
    batch: nullableString(formData, "batch"),
    year_joined: nullableString(formData, "year_joined"),
    current_position: nullableString(formData, "current_position"),
    bio: nullableString(formData, "bio"),
    status: requiredString(formData, "status") || "active",
  });

  const member = await createMember(payload);
  const image = formData.get("profile_image");
  if (image instanceof File && image.size > 0) {
    const profileImage = await uploadMemberImage(member.id, image);
    if (profileImage) {
      await updateMember(member.id, { profile_image: profileImage });
    }
  }

  await logActivity({
    actor_user_id: profile.id,
    action: "member.created",
    entity_type: "member",
    entity_id: member.id,
  });

  revalidatePath("/members");
  redirect(`/members/${member.id}`);
}

export async function updateMemberAction(memberId: string, formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    throw new Error("You do not have permission to update members.");
  }

  const payload = memberSchema.parse({
    full_name: requiredString(formData, "full_name"),
    email: requiredString(formData, "email"),
    gender: nullableString(formData, "gender"),
    date_of_birth: nullableString(formData, "date_of_birth"),
    phone_number: nullableString(formData, "phone_number"),
    whatsapp: nullableString(formData, "whatsapp"),
    telegram: nullableString(formData, "telegram"),
    village_in_myanmar: nullableString(formData, "village_in_myanmar"),
    current_city_in_india: nullableString(formData, "current_city_in_india"),
    state_in_india: nullableString(formData, "state_in_india"),
    university: nullableString(formData, "university"),
    major: nullableString(formData, "major"),
    batch: nullableString(formData, "batch"),
    year_joined: nullableString(formData, "year_joined"),
    current_position: nullableString(formData, "current_position"),
    bio: nullableString(formData, "bio"),
    status: requiredString(formData, "status") || "active",
  });

  const image = formData.get("profile_image");
  let profileImage: string | null = null;
  if (image instanceof File && image.size > 0) {
    profileImage = await uploadMemberImage(memberId, image);
  }

  await updateMember(memberId, {
    ...payload,
    ...(profileImage ? { profile_image: profileImage } : {}),
  });

  await logActivity({
    actor_user_id: profile.id,
    action: "member.updated",
    entity_type: "member",
    entity_id: memberId,
  });

  revalidatePath("/members");
  revalidatePath(`/members/${memberId}`);
  redirect(`/members/${memberId}`);
}

export async function deleteMemberAction(memberId: string) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    throw new Error("You do not have permission to delete members.");
  }

  await deleteMember(memberId);
  await logActivity({
    actor_user_id: profile.id,
    action: "member.deleted",
    entity_type: "member",
    entity_id: memberId,
  });

  revalidatePath("/members");
  redirect("/members");
}

export async function createLeadershipAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageLeadership(profile.role)) {
    throw new Error("You do not have permission to update leadership records.");
  }

  const payload = leadershipSchema.parse({
    member_id: requiredString(formData, "member_id"),
    leadership_position: requiredString(formData, "leadership_position"),
    term_start: requiredString(formData, "term_start"),
    term_end: nullableString(formData, "term_end"),
    description: nullableString(formData, "description"),
  });

  const record = await createLeadershipRecord(payload);
  await logActivity({
    actor_user_id: profile.id,
    action: "leadership.created",
    entity_type: "leadership_record",
    entity_id: record.id,
  });

  revalidatePath("/leadership");
  redirect("/leadership");
}

export async function createGraduateAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    throw new Error("You do not have permission to add graduate records.");
  }

  const payload = graduateSchema.parse({
    member_id: requiredString(formData, "member_id"),
    degree: requiredString(formData, "degree"),
    graduation_date: nullableString(formData, "graduation_date"),
    graduation_year: requiredString(formData, "graduation_year"),
    university: requiredString(formData, "university"),
    current_job: nullableString(formData, "current_job"),
    current_country: nullableString(formData, "current_country"),
    current_city: nullableString(formData, "current_city"),
    company: nullableString(formData, "company"),
    linkedin_url: nullableString(formData, "linkedin_url"),
  });

  const graduate = await createGraduateRecord({
    ...payload,
    linkedin_url: payload.linkedin_url || null,
  });
  await logActivity({
    actor_user_id: profile.id,
    action: "graduate.created",
    entity_type: "graduate",
    entity_id: graduate.id,
  });

  revalidatePath("/alumni");
  redirect("/alumni");
}
