"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { UserProfile } from "@/types/domain";
import { signOutAction } from "@/services/auth.actions";

export function Topbar({ profile }: { profile: UserProfile }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Sidebar pathname={pathname} profile={profile} mobile />
            </SheetContent>
          </Sheet>

          <form action="/members" className="hidden w-full max-w-md items-center gap-2 md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="query"
                placeholder="Search members, universities, majors..."
                className="h-11 w-full rounded-2xl border border-input bg-card px-11 text-sm outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-border bg-card p-1.5 pr-4 transition hover:bg-secondary">
                <Avatar className="size-9">
                  <AvatarImage src={undefined} />
                  <AvatarFallback name={profile.display_name || profile.email} />
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium">{profile.display_name || profile.email}</p>
                  <p className="text-xs text-muted-foreground">{profile.role_label}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/members">Members</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/directory">Directory</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOutAction} className="w-full">
                  <button type="submit" className="w-full text-left">
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
