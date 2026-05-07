import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth";
import { canManageMembers } from "@/lib/permissions";
import { memberSchema } from "@/lib/schemas";
import { deleteMember, getMemberById, updateMember } from "@/services/member.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  await getCurrentUserProfile();
  const { id } = await context.params;
  const data = await getMemberById(id);

  if (!data.member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const payload = memberSchema.partial().safeParse(body);

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const member = await updateMember(id, payload.data);
  return NextResponse.json(member);
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const profile = await getCurrentUserProfile();
  if (!canManageMembers(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  await deleteMember(id);
  return new NextResponse(null, { status: 204 });
}
