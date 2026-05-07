import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listDocuments } from "@/services/document.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  await getCurrentUserProfile();
  const { id } = await context.params;
  const document = (await listDocuments()).find((item) => item.id === id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (!env.isSupabaseConfigured) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Storage is unavailable" }, { status: 500 });
  }

  const { data, error } = await supabase.storage.from(env.documentBucket).createSignedUrl(document.file_path, 60);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message || "Unable to create download link" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
