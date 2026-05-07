import { CalendarRange } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { LeadershipRecord } from "@/types/domain";

export function LeadershipTimeline({ records }: { records: LeadershipRecord[] }) {
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id} className="border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="flex gap-4 p-5">
            <div className="mt-1 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarRange className="size-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold">{record.leadership_position}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.term_start)} to {record.term_end ? formatDate(record.term_end) : "Present"}
                  </p>
                </div>
                {record.member ? (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={record.member.profile_image || undefined} alt={record.member.full_name} />
                      <AvatarFallback name={record.member.full_name} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{record.member.email}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              {record.description ? <p className="text-sm leading-6 text-muted-foreground">{record.description}</p> : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
