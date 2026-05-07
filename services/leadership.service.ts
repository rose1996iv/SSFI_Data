import { mockLeadershipRecords, mockMembers } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { LeadershipRecord } from "@/types/domain";
import type { Database } from "@/types/database";

type LeadershipInsert = Database["public"]["Tables"]["leadership_records"]["Insert"];

export async function listLeadershipRecords() {
  if (!env.isSupabaseConfigured) {
    return mockLeadershipRecords;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockLeadershipRecords;
  }

  const { data, error } = await supabase
    .from("leadership_records")
    .select("*, members(id, full_name, profile_image, current_position, email)")
    .order("term_start", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((record: Record<string, unknown>) => ({
    ...record,
    member: record.members,
  })) as LeadershipRecord[];
}

export async function listCurrentLeaders() {
  const leadership = await listLeadershipRecords();
  return leadership.filter((record) => !record.term_end);
}

export async function createLeadershipRecord(payload: LeadershipInsert) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await (supabase as never as {
    from: (table: string) => {
      insert: (value: unknown) => { select: (query: string) => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
    };
  })
    .from("leadership_records")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data as { id: string };
}

export function getLeadershipTimelineByMember(memberId: string) {
  return mockLeadershipRecords.filter((record) => record.member_id === memberId);
}

export function attachMembersToLeadership() {
  return mockLeadershipRecords.map((record) => ({
    ...record,
    member: mockMembers.find((member) => member.id === record.member_id),
  }));
}
