import { slugify } from "@/lib/utils";
import { mockGraduates, mockLeadershipRecords, mockMembers } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { Member, MemberFilters, PaginatedResult } from "@/types/domain";
import type { Database } from "@/types/database";

type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

function applyMemberFilters(members: Member[], filters: MemberFilters) {
  const query = filters.query?.toLowerCase().trim();
  let result = [...members];

  if (query) {
    result = result.filter((member) =>
      [
        member.full_name,
        member.email,
        member.university,
        member.major,
        member.village_in_myanmar,
        member.state_in_india,
        member.current_position,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }

  const matchers = [
    ["university", filters.university],
    ["major", filters.major],
    ["village_in_myanmar", filters.village],
    ["state_in_india", filters.state],
    ["batch", filters.batch],
    ["current_position", filters.position],
  ] as const;

  for (const [key, value] of matchers) {
    if (value) {
      result = result.filter((member) => member[key]?.toLowerCase() === value.toLowerCase());
    }
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter((member) => member.status === filters.status);
  }

  const sort = filters.sort || "full_name.asc";
  result.sort((left, right) => {
    switch (sort) {
      case "full_name.desc":
        return right.full_name.localeCompare(left.full_name);
      case "created_at.desc":
        return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
      case "year_joined.desc":
        return (right.year_joined || 0) - (left.year_joined || 0);
      case "full_name.asc":
      default:
        return left.full_name.localeCompare(right.full_name);
    }
  });

  return result;
}

function paginate<T>(data: T[], page = 1, pageSize = 10): PaginatedResult<T> {
  const total = data.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: data.slice(start, end),
    total,
    page: safePage,
    pageSize,
    pageCount,
  };
}

export async function listMembers(filters: MemberFilters = {}) {
  if (!env.isSupabaseConfigured) {
    return paginate(applyMemberFilters(mockMembers, filters), filters.page || 1, filters.pageSize || 10);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return paginate(applyMemberFilters(mockMembers, filters), filters.page || 1, filters.pageSize || 10);
  }

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("members").select("*", { count: "exact" });

  if (filters.query) {
    const term = `%${filters.query}%`;
    query = query.or(
      `full_name.ilike.${term},email.ilike.${term},university.ilike.${term},major.ilike.${term},current_position.ilike.${term}`,
    );
  }

  if (filters.university) query = query.eq("university", filters.university);
  if (filters.major) query = query.eq("major", filters.major);
  if (filters.village) query = query.eq("village_in_myanmar", filters.village);
  if (filters.state) query = query.eq("state_in_india", filters.state);
  if (filters.batch) query = query.eq("batch", filters.batch);
  if (filters.position) query = query.eq("current_position", filters.position);
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const [sortColumn, sortDirection] = (filters.sort || "full_name.asc").split(".") as [string, "asc" | "desc"];
  const { data, count, error } = await query.order(sortColumn, { ascending: sortDirection === "asc" }).range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: (data || []) as Member[],
    total: count || 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count || 0) / pageSize)),
  } satisfies PaginatedResult<Member>;
}

export async function listAllMembers() {
  const result = await listMembers({ page: 1, pageSize: 200, sort: "full_name.asc" });
  return result.data;
}

export async function getMemberById(id: string) {
  if (!env.isSupabaseConfigured) {
    const member = mockMembers.find((item) => item.id === id) || null;
    return {
      member,
      leadership: mockLeadershipRecords.filter((record) => record.member_id === id),
      graduates: mockGraduates.filter((record) => record.member_id === id),
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      member: mockMembers.find((item) => item.id === id) || null,
      leadership: mockLeadershipRecords.filter((record) => record.member_id === id),
      graduates: mockGraduates.filter((record) => record.member_id === id),
    };
  }

  const [{ data: member }, { data: leadership }, { data: graduates }] = await Promise.all([
    supabase.from("members").select("*").eq("id", id).maybeSingle(),
    supabase.from("leadership_records").select("*").eq("member_id", id).order("term_start", { ascending: false }),
    supabase.from("graduates").select("*").eq("member_id", id).order("graduation_year", { ascending: false }),
  ]);

  return {
    member: (member as Member | null) || null,
    leadership: leadership || [],
    graduates: graduates || [],
  };
}

export async function createMember(payload: MemberInsert) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await (supabase as never as {
    from: (table: string) => {
      insert: (value: unknown) => { select: (query: string) => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
    };
  })
    .from("members")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data as Member;
}

export async function updateMember(id: string, payload: MemberUpdate) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await (supabase as never as {
    from: (table: string) => {
      update: (value: unknown) => {
        eq: (column: string, value: string) => {
          select: (query: string) => { single: () => Promise<{ data: unknown; error: { message: string } | null }> };
        };
      };
    };
  })
    .from("members")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data as Member;
}

export async function deleteMember(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadMemberImage(memberId: string, file: File) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const extension = file.name.split(".").pop() || "jpg";
  const filePath = `members/${memberId}/${slugify(file.name.replace(`.${extension}`, ""))}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(env.memberBucket).upload(filePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(env.memberBucket).getPublicUrl(filePath);
  return data.publicUrl;
}
