import Link from "next/link";
import { Mail, MapPin, Pencil, Phone, UserRoundX } from "lucide-react";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getMemberById } from "@/services/member.service";

type RouteParams = Promise<{ id: string }>;

export default async function MemberDetailPage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const { member, leadership, graduates } = await getMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Profile"
        title={member.full_name}
        description="Review the complete member profile, organizational role, leadership history, and graduate relationships."
        actions={
          <Button asChild className="rounded-2xl">
            <Link href={`/members/${member.id}/edit`}>
              <Pencil className="size-4" />
              Edit member
            </Link>
          </Button>
        }
      />

      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <Avatar className="size-24">
              <AvatarImage src={member.profile_image || undefined} alt={member.full_name} />
              <AvatarFallback name={member.full_name} />
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={member.status} />
                {member.current_position ? <Badge variant="outline">{member.current_position}</Badge> : null}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{member.bio || "No biography has been added yet."}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile icon={Mail} label="Email" value={member.email} />
            <InfoTile icon={Phone} label="Phone" value={member.phone_number || member.whatsapp || "Not added"} />
            <InfoTile icon={MapPin} label="Village in Myanmar" value={member.village_in_myanmar || "Not added"} />
            <InfoTile
              icon={MapPin}
              label="Current city and state"
              value={[member.current_city_in_india, member.state_in_india].filter(Boolean).join(", ") || "Not added"}
            />
            <InfoTile label="University" value={member.university || "Not added"} />
            <InfoTile label="Major" value={member.major || "Not added"} />
            <InfoTile label="Batch" value={member.batch || "Not added"} />
            <InfoTile label="Year joined" value={member.year_joined ? String(member.year_joined) : "Not added"} />
            <InfoTile label="Date of birth" value={member.date_of_birth ? formatDate(member.date_of_birth) : "Not added"} />
            <InfoTile label="Telegram" value={member.telegram || "Not added"} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Leadership history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadership.length ? (
              leadership.map((record) => (
                <div key={record.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium">{record.leadership_position}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.term_start)} to {record.term_end ? formatDate(record.term_end) : "Present"}
                  </p>
                  {record.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{record.description}</p> : null}
                </div>
              ))
            ) : (
              <EmptyState
                icon={UserRoundX}
                title="No leadership history"
                body="This member has not been linked to leadership records yet."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Graduate and alumni records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {graduates.length ? (
              graduates.map((record) => (
                <div key={record.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium">
                    {record.degree} · {record.graduation_year}
                  </p>
                  <p className="text-sm text-muted-foreground">{record.university}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {record.current_job || record.company || "Current role not added"}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={UserRoundX}
                title="No graduate record"
                body="Add a graduate record in the alumni module once this member completes a degree."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Mail;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        {Icon ? <Icon className="size-4 text-primary" /> : null}
        {label}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
