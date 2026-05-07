import { slugify } from "@/lib/utils";
import { env } from "@/lib/env";
import { mockDocuments } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DocumentFilters, DocumentRecord } from "@/types/domain";
import type { Database } from "@/types/database";

type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

export async function listDocuments(filters: DocumentFilters = {}) {
  if (!env.isSupabaseConfigured) {
    let data = mockDocuments;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      data = data.filter((item) =>
        [item.title, item.description, item.category, item.file_name]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query)),
      );
    }
    if (filters.category && filters.category !== "all") {
      data = data.filter((item) => item.category === filters.category);
    }
    return data;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockDocuments;
  }

  let query = supabase.from("documents").select("*").order("created_at", { ascending: false });

  if (filters.query) {
    const term = `%${filters.query}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term},file_name.ilike.${term}`);
  }

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as DocumentRecord[];
}

export async function uploadDocument(file: File, metadata: Omit<DocumentInsert, "file_path" | "file_name">) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const extension = file.name.split(".").pop() || "bin";
  const filePath = `${metadata.category}/${slugify(file.name.replace(`.${extension}`, ""))}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(env.documentBucket).upload(filePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const payload = {
    ...metadata,
    file_path: filePath,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
  } satisfies DocumentInsert;

  const { data, error } = await (supabase as never as {
    from: (table: string) => {
      insert: (value: unknown) => { select: (query: string) => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
    };
  })
    .from("documents")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data as DocumentRecord;
}
