import Link from "next/link";
import { redirect } from "next/navigation";

import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DemoBanner } from "@/components/shared/demo-banner";
import { PageIntro } from "@/components/shared/page-intro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardLandingByRole } from "@/lib/constants/app";
import { getCurrentUserProfile } from "@/lib/auth";
import { getDashboardSnapshot } from "@/services/dashboard.service";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();
  const preferredHome = dashboardLandingByRole[profile.role];
  if (preferredHome !== "/dashboard") {
    redirect(preferredHome);
  }

  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Analytics"
        title="Organizational overview"
        description="Track the size, structure, and continuity of SSFI through real-time member, leadership, alumni, and document insights."
        actions={
          <Button asChild className="rounded-2xl">
            <Link href="/members/new">Add member</Link>
          </Button>
        }
      />
      <DemoBanner />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AnalyticsPanel
        stateData={snapshot.membersByState}
        universityData={snapshot.membersByUniversity}
        majorData={snapshot.membersByMajor}
        graduationData={snapshot.graduationStats}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current leaders</CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-2xl">
              <Link href="/leadership">View archive</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.activeLeaders.map((leader) => (
              <div key={leader.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={leader.member?.profile_image || undefined} alt={leader.member?.full_name || leader.leadership_position} />
                    <AvatarFallback name={leader.member?.full_name || leader.leadership_position} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{leader.member?.full_name || "Leader"}</p>
                    <p className="text-sm text-muted-foreground">{leader.leadership_position}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(leader.term_start, "yyyy")}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent documents</CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-2xl">
              <Link href="/documents">Open library</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.recentDocuments.map((document) => (
              <div key={document.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{document.title}</p>
                    <p className="text-sm text-muted-foreground">{document.category}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(document.created_at)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
