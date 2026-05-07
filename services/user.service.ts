import { mockActivities, mockMembers, demoUser } from "@/lib/mock-data";
import { roleOptions } from "@/lib/constants/app";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { ActivityRecord, AppRole, UserDirectoryRecord } from "@/types/domain";

function buildDemoUsers(): UserDirectoryRecord[] {
  return [
    {
      id: demoUser.id,
      email: demoUser.email,
      display_name: demoUser.display_name,
      member_id: demoUser.member_id,
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: demoUser.role,
      role_label: demoUser.role_label,
      member: mockMembers.find((member) => member.id === demoUser.member_id) || null,
    },
    {
      id: "demo-pending-user-1",
      email: "pending.member@ssfi.org",
      display_name: "Pending Member",
      member_id: "member-004",
      is_approved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: "member",
      role_label: "Member",
      member: mockMembers.find((member) => member.id === "member-004") || null,
    },
  ];
}

function normalizeRoleLabel(role: string) {
  return roleOptions.find((option) => option.key === role)?.name || "Guest";
}

export async function listUsers() {
  if (!env.isSupabaseConfigured) {
    return buildDemoUsers();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return buildDemoUsers();
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, display_name, member_id, is_approved, created_at, updated_at, roles(key, name), members(id, full_name, email, status)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((record: Record<string, unknown>) => {
    const roleRecord = (record.roles as { key?: AppRole; name?: string } | null) || null;
    return {
      id: String(record.id),
      email: String(record.email),
      display_name: (record.display_name as string | null) || null,
      member_id: (record.member_id as string | null) || null,
      is_approved: Boolean(record.is_approved),
      created_at: String(record.created_at),
      updated_at: String(record.updated_at),
      role: (roleRecord?.key || "guest") as AppRole,
      role_label: roleRecord?.name || normalizeRoleLabel(roleRecord?.key || "guest"),
      member: (record.members as UserDirectoryRecord["member"]) || null,
    } satisfies UserDirectoryRecord;
  });
}

export async function listActivities(limit = 20) {
  if (!env.isSupabaseConfigured) {
    return mockActivities.slice(0, limit);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockActivities.slice(0, limit);
  }

  const { data, error } = await supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as ActivityRecord[];
}

export async function updateUserApproval(userId: string, isApproved: boolean) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await (supabase as never as {
    from: (table: string) => {
      update: (value: unknown) => {
        eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    };
  })
    .from("users")
    .update({ is_approved: isApproved })
    .eq("id", userId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUserRole(userId: string, role: AppRole) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const roleRecord = roleOptions.find((option) => option.key === role);
  if (!roleRecord) {
    throw new Error("Invalid role.");
  }

  const { data: dbRole, error: roleError } = (await (supabase as never as {
    from: (table: string) => {
      select: (query: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
        };
      };
    };
  })
    .from("roles")
    .select("id")
    .eq("key", role)
    .maybeSingle()) as {
    data: { id: string } | null;
    error: { message: string } | null;
  };
  if (roleError || !dbRole?.id) {
    throw new Error(roleError?.message || "Role was not found.");
  }

  const { error } = await (supabase as never as {
    from: (table: string) => {
      update: (value: unknown) => {
        eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    };
  })
    .from("users")
    .update({ role_id: dbRole.id })
    .eq("id", userId);
  if (error) {
    throw new Error(error.message);
  }
}
