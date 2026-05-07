import type { AppRole } from "@/types/domain";

const roleRank: Record<AppRole, number> = {
  guest: 0,
  alumni: 1,
  member: 2,
  executive: 3,
  admin: 4,
  super_admin: 5,
};

export function hasMinimumRole(role: AppRole, minimumRole: AppRole) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canManageMembers(role: AppRole) {
  return hasMinimumRole(role, "executive");
}

export function canManageLeadership(role: AppRole) {
  return hasMinimumRole(role, "executive");
}

export function canManageDocuments(role: AppRole) {
  return hasMinimumRole(role, "admin");
}

export function canManageUsers(role: AppRole) {
  return hasMinimumRole(role, "admin");
}

export function canAccessAdmin(role: AppRole) {
  return hasMinimumRole(role, "admin");
}
