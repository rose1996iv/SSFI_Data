import { Archive } from "lucide-react";

import { LeadershipTimeline } from "@/components/dashboard/leadership-timeline";
import { LeadershipForm } from "@/components/forms/leadership-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { listLeadershipRecords } from "@/services/leadership.service";
import { listAllMembers } from "@/services/member.service";
import { createLeadershipAction } from "@/services/member.actions";

export default async function LeadershipPage() {
  const [records, members] = await Promise.all([listLeadershipRecords(), listAllMembers()]);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Leadership"
        title="Leadership history"
        description="Preserve organizational continuity with a searchable archive of leadership terms, current positions, and historical transitions."
      />
      <LeadershipForm action={createLeadershipAction} members={members} />
      {records.length ? (
        <LeadershipTimeline records={records} />
      ) : (
        <EmptyState
          icon={Archive}
          title="No leadership records yet"
          body="Add the first leadership record to start preserving SSFI term history."
        />
      )}
    </div>
  );
}
