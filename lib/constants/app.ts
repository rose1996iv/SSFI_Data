import type { AppRole, RoleOption } from "@/types/domain";

export const appNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Members", href: "/members" },
  { title: "Leadership", href: "/leadership" },
  { title: "Alumni", href: "/alumni" },
  { title: "Documents", href: "/documents" },
  { title: "Directory", href: "/directory" },
] as const;

export const roleOptions: RoleOption[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    key: "super_admin",
    description: "Full access to every module, policy, and user administration flow.",
  },
  {
    id: "role-admin",
    name: "Admin",
    key: "admin",
    description: "Operational management across members, alumni, documents, and analytics.",
  },
  {
    id: "role-executive",
    name: "Executive",
    key: "executive",
    description: "Leadership-oriented access with visibility into organizational history.",
  },
  {
    id: "role-member",
    name: "Member",
    key: "member",
    description: "Standard member access with personal profile and directory visibility.",
  },
  {
    id: "role-alumni",
    name: "Alumni",
    key: "alumni",
    description: "Alumni directory and limited member contact access.",
  },
  {
    id: "role-guest",
    name: "Guest",
    key: "guest",
    description: "Read-only access for onboarding and limited discovery.",
  },
];

export const dashboardLandingByRole: Record<AppRole, string> = {
  super_admin: "/dashboard",
  admin: "/dashboard",
  executive: "/dashboard",
  member: "/directory",
  alumni: "/alumni",
  guest: "/dashboard",
};
