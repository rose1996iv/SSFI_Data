import { NextResponse, type NextRequest } from "next/server";

import { getOptionalUserProfile } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { globalSearch } from "@/services/search.service";

export async function GET(request: NextRequest) {
  const profile = await getOptionalUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(`search:${profile.id}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get("query") || "";
  if (!query) {
    return NextResponse.json({ members: [], documents: [] });
  }

  const results = await globalSearch(query);
  return NextResponse.json(results);
}
