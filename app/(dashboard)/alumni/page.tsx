import { GraduationCap } from "lucide-react";

import { AlumniGrid } from "@/components/dashboard/alumni-grid";
import { GraduateForm } from "@/components/forms/graduate-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { listGraduates } from "@/services/graduate.service";
import { listAllMembers } from "@/services/member.service";
import { createGraduateAction } from "@/services/member.actions";

export default async function AlumniPage() {
  const [graduates, members] = await Promise.all([listGraduates(), listAllMembers()]);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Alumni"
        title="Graduate and alumni directory"
        description="Keep graduate records linked to member profiles while tracking degree history, career outcomes, and alumni engagement."
      />
      <GraduateForm action={createGraduateAction} members={members} />
      {graduates.length ? (
        <AlumniGrid records={graduates} />
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No alumni records yet"
          body="Add a graduate record to start the alumni archive and connect it to the original member profile."
        />
      )}
    </div>
  );
}
