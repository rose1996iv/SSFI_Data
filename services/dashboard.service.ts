import { mockDashboardSnapshot } from "@/lib/mock-data";
import { env } from "@/lib/env";
import type { ChartDatum, DashboardSnapshot, DocumentRecord, GraduateRecord, LeadershipRecord, Member } from "@/types/domain";

import { listDocuments } from "@/services/document.service";
import { listGraduates } from "@/services/graduate.service";
import { listCurrentLeaders } from "@/services/leadership.service";
import { listMembers } from "@/services/member.service";

function aggregateBy(items: Member[], key: keyof Member) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const value = item[key];
    if (!value || typeof value !== "string") continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);
}

function aggregateGraduation(graduates: GraduateRecord[]) {
  const counts = new Map<string, number>();

  for (const graduate of graduates) {
    const label = String(graduate.graduation_year);
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => Number(left.label) - Number(right.label));
}

function buildMetrics(members: Member[], graduates: GraduateRecord[], leaders: LeadershipRecord[], documents: DocumentRecord[]) {
  return [
    {
      label: "Total members",
      value: members.length,
      helper: `${members.filter((member) => member.status === "active").length} active profiles`,
      trend: 8,
    },
    {
      label: "Total alumni",
      value: graduates.length,
      helper: `${graduates.filter((graduate) => graduate.graduation_year >= new Date().getFullYear() - 1).length} recent graduates`,
      trend: 4,
    },
    {
      label: "Active leaders",
      value: leaders.length,
      helper: "Current office bearers",
      trend: 0,
    },
    {
      label: "Documents",
      value: documents.length,
      helper: "Stored in secure Supabase buckets",
      trend: 3,
    },
  ];
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!env.isSupabaseConfigured) {
    return mockDashboardSnapshot;
  }

  const membersResult = await listMembers({ page: 1, pageSize: 300, sort: "created_at.desc" });
  const [graduates, leaders, documents] = await Promise.all([listGraduates(), listCurrentLeaders(), listDocuments()]);
  const members = membersResult.data;

  return {
    metrics: buildMetrics(members, graduates, leaders, documents),
    membersByState: aggregateBy(members, "state_in_india"),
    membersByUniversity: aggregateBy(members, "university"),
    membersByMajor: aggregateBy(members, "major"),
    graduationStats: aggregateGraduation(graduates),
    activeLeaders: leaders,
    recentMembers: members.slice(0, 5),
    recentDocuments: documents.slice(0, 5),
  };
}

export function toChartData(data: ChartDatum[]) {
  return data.map((item) => ({
    name: item.label,
    value: item.value,
  }));
}
