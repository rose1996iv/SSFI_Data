import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { refreshSession } from "@/lib/supabase/middleware";

const protectedPrefixes = [
  "/dashboard",
  "/members",
  "/leadership",
  "/alumni",
  "/documents",
  "/directory",
  "/api/members",
  "/api/search",
  "/api/documents",
];

const authPages = ["/login", "/forgot-password"];

export async function middleware(request: NextRequest) {
  if (!env.isSupabaseConfigured) {
    return NextResponse.next();
  }

  const response = await refreshSession(request);
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"));

  if (isProtected && !hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
