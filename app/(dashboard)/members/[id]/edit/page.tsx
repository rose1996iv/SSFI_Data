import { notFound } from "next/navigation";

import { MemberForm } from "@/components/forms/member-form";
import { PageIntro } from "@/components/shared/page-intro";
import { getMemberById } from "@/services/member.service";
import { updateMemberAction } from "@/services/member.actions";

type RouteParams = Promise<{ id: string }>;

export default async function EditMemberPage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const { member } = await getMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Members"
        title={`Edit ${member.full_name}`}
        description="Update the member profile, contact details, academic information, and organizational status."
      />
      <MemberForm action={updateMemberAction.bind(null, member.id)} member={member} />
    </div>
  );
}
