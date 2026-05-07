import { mockGraduates, mockMembers } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { GraduateFilters, GraduateRecord } from "@/types/domain";
import type { Database } from "@/types/database";

type GraduateInsert = Database["public"]["Tables"]["graduates"]["Insert"];

export async function listGraduates(filters: GraduateFilters = {}) {
  if (!env.isSupabaseConfigured) {
    let data = mockGraduates;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      data = data.filter((item) =>
        [item.degree, item.university, item.current_job, item.company, item.member?.full_name]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query)),
      );
    }

    if (filters.graduationYear) {
      data = data.filter((item) => item.graduation_year === filters.graduationYear);
    }

    if (filters.university) {
      data = data.filter((item) => item.university === filters.university);
    }

    return data;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockGraduates;
  }

  let query = supabase
    .from("graduates")
    .select("*, members(id, full_name, profile_image, email, phone_number)")
    .order("graduation_year", { ascending: false });

  if (filters.query) {
    const term = `%${filters.query}%`;
    query = query.or(`degree.ilike.${term},university.ilike.${term},company.ilike.${term},current_job.ilike.${term}`);
  }

  if (filters.graduationYear) query = query.eq("graduation_year", filters.graduationYear);
  if (filters.university) query = query.eq("university", filters.university);

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((record: Record<string, unknown>) => ({
    ...record,
    member: record.members,
  })) as GraduateRecord[];
}

export async function createGraduateRecord(payload: GraduateInsert) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await (supabase as never as {
    from: (table: string) => {
      insert: (value: unknown) => { select: (query: string) => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
    };
  })
    .from("graduates")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data as { id: string };
}

export function listGraduatesForMember(memberId: string) {
  return mockGraduates
    .filter((item) => item.member_id === memberId)
    .map((item) => ({ ...item, member: mockMembers.find((member) => member.id === memberId) }));
}
