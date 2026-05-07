import { NextResponse, type NextRequest } from "next/server";

import { dashboardLandingByRole } from "@/lib/constants/app";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/domain";

export async function GET(request: NextRequest) {
  if (!env.isSupabaseConfigured) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Fetch user role for proper redirect
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("is_approved, roles(key)")
            .eq("id", user.id)
            .maybeSingle();

          const typedDbUser = dbUser as {
            is_approved: boolean;
            roles: { key?: AppRole } | null;
          } | null;

          // Not approved → sign out and redirect to login
          if (typedDbUser && !typedDbUser.is_approved) {
            await supabase.auth.signOut();
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("error", "pending_approval");
            return NextResponse.redirect(loginUrl);
          }

          const role = (typedDbUser?.roles as { key?: AppRole } | null)?.key ?? "guest";
          const destination = dashboardLandingByRole[role as AppRole] ?? "/dashboard";
          return NextResponse.redirect(new URL(destination, request.url));
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
