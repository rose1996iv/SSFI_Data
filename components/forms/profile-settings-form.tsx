"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/shared/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDisplayNameAction, updatePasswordAction } from "@/services/profile.actions";
import type { ActionState } from "@/services/auth.actions";
import type { UserProfile } from "@/types/domain";

const initialState: ActionState = {};

export function ProfileSettingsForm({ profile }: { profile: UserProfile }) {
  const [nameState, nameAction] = useActionState(updateDisplayNameAction, initialState);
  const [passwordState, passwordAction] = useActionState(updatePasswordAction, initialState);

  return (
    <div className="space-y-8">
      {/* Display Name Section */}
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur">
        <h2 className="mb-1 text-lg font-semibold">Display name</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          This is the name shown across the platform.
        </p>
        <form id="display-name-form" action={nameAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={profile.display_name || ""}
              placeholder="Your display name"
              required
              className="max-w-sm"
            />
          </div>
          {nameState.error ? (
            <Alert variant="destructive">
              <AlertDescription>{nameState.error}</AlertDescription>
            </Alert>
          ) : null}
          {nameState.success ? (
            <Alert>
              <AlertDescription className="text-green-600 dark:text-green-400">
                {nameState.success}
              </AlertDescription>
            </Alert>
          ) : null}
          <SubmitButton className="rounded-2xl" pendingLabel="Saving...">
            Save name
          </SubmitButton>
        </form>
      </div>

      {/* Password Section */}
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur">
        <h2 className="mb-1 text-lg font-semibold">Change password</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Set a new password for your account. Must be at least 8 characters.
        </p>
        <form id="password-form" action={passwordAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="New password"
              required
              className="max-w-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm new password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Repeat new password"
              required
              className="max-w-sm"
            />
          </div>
          {passwordState.error ? (
            <Alert variant="destructive">
              <AlertDescription>{passwordState.error}</AlertDescription>
            </Alert>
          ) : null}
          {passwordState.success ? (
            <Alert>
              <AlertDescription className="text-green-600 dark:text-green-400">
                {passwordState.success}
              </AlertDescription>
            </Alert>
          ) : null}
          <SubmitButton className="rounded-2xl" pendingLabel="Updating...">
            Update password
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
