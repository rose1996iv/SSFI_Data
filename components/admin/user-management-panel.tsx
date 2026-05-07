import { CheckCircle2, Clock3, Shield, UserRound } from "lucide-react";

import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { roleOptions } from "@/lib/constants/app";
import type { UserDirectoryRecord } from "@/types/domain";
import { approveUserAction, updateUserRoleAction } from "@/services/user.actions";

export function UserManagementPanel({ users }: { users: UserDirectoryRecord[] }) {
  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle>User management and approvals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{user.display_name || user.email}</p>
                  <Badge variant="secondary">{user.role_label}</Badge>
                  {user.is_approved ? (
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" variant="secondary">
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300" variant="secondary">
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3.5" />
                    Joined {formatDate(user.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="size-3.5" />
                    {user.member?.full_name || "No linked member profile"}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[auto_1fr] xl:min-w-[360px]">
                <form action={approveUserAction}>
                  <input type="hidden" name="user_id" value={user.id} />
                  <input type="hidden" name="approve" value={user.is_approved ? "false" : "true"} />
                  <SubmitButton
                    size="sm"
                    className="w-full rounded-2xl"
                    pendingLabel={user.is_approved ? "Revoking..." : "Approving..."}
                  >
                    <CheckCircle2 className="size-4" />
                    {user.is_approved ? "Revoke" : "Approve"}
                  </SubmitButton>
                </form>

                <form action={updateUserRoleAction} className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <input type="hidden" name="user_id" value={user.id} />
                  <div className="space-y-2">
                    <Label htmlFor={`role-${user.id}`}>Role</Label>
                    <Select id={`role-${user.id}`} name="role" defaultValue={user.role}>
                      {roleOptions.map((role) => (
                        <option key={role.key} value={role.key}>
                          {role.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <SubmitButton size="sm" variant="outline" className="w-full rounded-2xl" pendingLabel="Updating...">
                      <Shield className="size-4" />
                      Save role
                    </SubmitButton>
                  </div>
                </form>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Linked member status: {user.member?.status || "Not linked"}</span>
              <span>Last updated: {formatDate(user.updated_at)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
