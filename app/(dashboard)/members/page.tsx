import Link from "next/link";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { MemberTable } from "@/components/members/member-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { listMembers } from "@/services/member.service";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MembersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const result = await listMembers({
    query: typeof params.query === "string" ? params.query : undefined,
    university: typeof params.university === "string" ? params.university : undefined,
    major: typeof params.major === "string" ? params.major : undefined,
    village: typeof params.village === "string" ? params.village : undefined,
    state: typeof params.state === "string" ? params.state : undefined,
    batch: typeof params.batch === "string" ? params.batch : undefined,
    position: typeof params.position === "string" ? params.position : undefined,
    status: typeof params.status === "string" ? (params.status as "active" | "inactive" | "alumni" | "all") : "all",
    sort: typeof params.sort === "string" ? (params.sort as "full_name.asc" | "full_name.desc" | "created_at.desc" | "year_joined.desc") : "full_name.asc",
    page: Number(typeof params.page === "string" ? params.page : 1),
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Members"
        title="Member management"
        description="Create, search, filter, and review SSFI member records with a normalized profile structure built for long-term organizational continuity."
        actions={
          <Button asChild className="rounded-2xl">
            <Link href="/members/new">Add member</Link>
          </Button>
        }
      />

      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="p-6">
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2 xl:col-span-2">
              <Label htmlFor="query">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="query" name="query" defaultValue={typeof params.query === "string" ? params.query : ""} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={typeof params.status === "string" ? params.status : "all"}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="alumni">Alumni</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">Sort</Label>
              <Select id="sort" name="sort" defaultValue={typeof params.sort === "string" ? params.sort : "full_name.asc"}>
                <option value="full_name.asc">Name A-Z</option>
                <option value="full_name.desc">Name Z-A</option>
                <option value="created_at.desc">Newest first</option>
                <option value="year_joined.desc">Latest join year</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" name="university" defaultValue={typeof params.university === "string" ? params.university : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input id="major" name="major" defaultValue={typeof params.major === "string" ? params.major : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Input id="village" name="village" defaultValue={typeof params.village === "string" ? params.village : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={typeof params.state === "string" ? params.state : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input id="batch" name="batch" defaultValue={typeof params.batch === "string" ? params.batch : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" defaultValue={typeof params.position === "string" ? params.position : ""} />
            </div>
            <div className="flex items-end gap-3 xl:col-span-2">
              <Button type="submit" className="rounded-2xl">
                Apply filters
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/members">Reset</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result.data.length ? (
        <MemberTable result={result} />
      ) : (
        <EmptyState
          icon={Search}
          title="No members found"
          body="Try adjusting your filters or add the first member record to start building the SSFI directory."
        />
      )}
    </div>
  );
}
