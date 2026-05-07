import { MemberForm } from "@/components/forms/member-form";
import { PageIntro } from "@/components/shared/page-intro";
import { createMemberAction } from "@/services/member.actions";

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Members"
        title="Add member"
        description="Create a new member profile with academic, contact, and organizational information."
      />
      <MemberForm action={createMemberAction} />
    </div>
  );
}
