import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth";
import { canManageMembers } from "@/lib/permissions";
import { memberSchema } from "@/lib/schemas";
import { createMember, listMembers } from "@/services/member.service";

export async function GET(request: NextRequest) {
  await getCurrentUserProfile();

  const params = request.nextUrl.searchParams;
  const data = await listMembers({
    query: params.get("query") || undefined,
    university: params.get("university") || undefined,
    major: params.get("major") || undefined,
    village: params.get("village") || undefined,
    state: params.get("state") || undefined,
    batch: params.get("batch") || undefined,
    position: params.get("position") || undefined,
    status: (params.get("status") as "active" | "inactive" | "alumni" | "all" | null) || "all",
    page: Number(params.get("page") || 1),
    pageSize: Number(params.get("pageSize") || 10),
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const payload = memberSchema.safeParse(body);
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const member = await createMember(payload.data);
  return NextResponse.json(member, { status: 201 });
}
