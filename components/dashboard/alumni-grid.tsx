import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GraduateRecord } from "@/types/domain";

export function AlumniGrid({ records }: { records: GraduateRecord[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {records.map((graduate) => (
        <Card key={graduate.id} className="border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={graduate.member?.profile_image || undefined} alt={graduate.member?.full_name || graduate.degree} />
                <AvatarFallback name={graduate.member?.full_name || graduate.degree} />
              </Avatar>
              <div>
                <p className="font-semibold">{graduate.member?.full_name || "Graduate record"}</p>
                <p className="text-sm text-muted-foreground">
                  {graduate.degree} · {graduate.graduation_year}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{graduate.university}</p>
              <p>{graduate.current_job || graduate.company || "Current role not set"}</p>
              <p>
                {[graduate.current_city, graduate.current_country].filter(Boolean).join(", ") || "Location not set"}
              </p>
            </div>
            {graduate.member ? (
              <Button asChild variant="outline" size="sm" className="rounded-2xl">
                <Link href={`/members/${graduate.member.id}`}>Open profile</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
