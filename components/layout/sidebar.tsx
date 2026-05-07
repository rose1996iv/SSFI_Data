import Link from "next/link";
import { Archive, BookUser, ChartNoAxesCombined, ContactRound, FileStack, Users } from "lucide-react";

import { LogoMark } from "@/components/shared/logo-mark";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/domain";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { href: "/members", label: "Members", icon: Users },
  { href: "/leadership", label: "Leadership", icon: Archive },
  { href: "/alumni", label: "Alumni", icon: BookUser },
  { href: "/documents", label: "Documents", icon: FileStack },
  { href: "/directory", label: "Directory", icon: ContactRound },
];

export function Sidebar({ pathname, profile, mobile = false }: { pathname: string; profile: UserProfile; mobile?: boolean }) {
  return (
    <div className={cn("flex h-full flex-col gap-6", mobile ? "pt-8" : "p-6")}>
      <div className="flex items-center gap-3">
        <LogoMark />
        <div>
          <p className="font-semibold">SSFI Data Center</p>
          <p className="text-xs text-muted-foreground">Private admin platform</p>
        </div>
      </div>

      <Badge variant="secondary" className="w-fit">
        {profile.role_label}
      </Badge>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-border bg-background/70 p-4">
        <p className="text-sm font-semibold">Future-ready foundation</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          The schema and service layer are prepared for attendance, events, scholarships, QR cards, messaging, and AI
          search.
        </p>
      </div>
    </div>
  );
}
