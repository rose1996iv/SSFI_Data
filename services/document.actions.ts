"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserProfile } from "@/lib/auth";
import { canManageDocuments } from "@/lib/permissions";
import { documentSchema } from "@/lib/schemas";
import { uploadDocument } from "@/services/document.service";
import { logActivity } from "@/services/activity.service";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function uploadDocumentAction(formData: FormData) {
  const profile = await getCurrentUserProfile();
  if (!canManageDocuments(profile.role)) {
    throw new Error("You do not have permission to upload documents.");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please choose a file to upload.");
  }

  const payload = documentSchema.parse({
    title: value(formData, "title"),
    description: value(formData, "description") || null,
    category: value(formData, "category"),
  });

  const document = await uploadDocument(file, {
    ...payload,
    uploaded_by: profile.id,
  });

  await logActivity({
    actor_user_id: profile.id,
    action: "document.uploaded",
    entity_type: "document",
    entity_id: document.id,
  });

  revalidatePath("/documents");
  redirect("/documents");
}
