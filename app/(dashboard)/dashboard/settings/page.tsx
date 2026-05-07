import { PageIntro } from "@/components/shared/page-intro";
import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { getCurrentUserProfile } from "@/lib/auth";

export const metadata = {
  title: "Account Settings – SSFI Data Center",
  description: "Update your display name and password.",
};

export default async function SettingsPage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Account"
        title="Settings"
        description="Manage your account display name and password. These changes apply only to your own account."
      />
      <div className="max-w-2xl">
        <ProfileSettingsForm profile={profile} />
      </div>
    </div>
  );
}
