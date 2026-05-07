import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { ActivityLogPanel } from "@/components/admin/activity-log-panel";
import { UserManagementPanel } from "@/components/admin/user-management-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { canAccessAdmin } from "@/lib/permissions";
import { getCurrentUserProfile } from "@/lib/auth";
import { listActivities, listUsers } from "@/services/user.service";

export default async function AdminPage() {
  const profile = await getCurrentUserProfile();
  if (!canAccessAdmin(profile.role)) {
    redirect("/dashboard");
  }

  const [users, activities] = await Promise.all([listUsers(), listActivities(12)]);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Administration"
        title="User approvals, access roles, and activity oversight"
        description="Manage pending accounts, adjust role-based access, and review recent operational activity from one admin workspace."
      />

      {users.length ? (
        <UserManagementPanel users={users} />
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="No user accounts yet"
          body="Once people start signing in, pending user accounts and role assignments will appear here."
        />
      )}

      {activities.length ? <ActivityLogPanel activities={activities} /> : null}
    </div>
  );
}
