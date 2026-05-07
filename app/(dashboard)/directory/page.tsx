import { ContactRound } from "lucide-react";

import { DirectoryGrid } from "@/components/dashboard/directory-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { listMembers } from "@/services/member.service";

export default async function DirectoryPage() {
  const result = await listMembers({ page: 1, pageSize: 60, status: "active", sort: "full_name.asc" });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Directory"
        title="Communication directory"
        description="Browse member contact details and jump directly into email, phone, WhatsApp, or Telegram communication flows."
      />
      {result.data.length ? (
        <DirectoryGrid members={result.data} />
      ) : (
        <EmptyState
          icon={ContactRound}
          title="Directory is empty"
          body="Add active members to populate the communication directory."
        />
      )}
    </div>
  );
}
