import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logActivity(input: {
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  await (supabase as never as { from: (table: string) => { insert: (value: unknown) => Promise<unknown> } })
    .from("activities")
    .insert(input);
}
