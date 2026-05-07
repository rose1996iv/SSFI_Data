import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { relativeTime } from "@/utils/format";
import type { ActivityRecord } from "@/types/domain";

export function ActivityLogPanel({ activities }: { activities: ActivityRecord[] }) {
  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent activity logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{activity.entity_type}</Badge>
              <p className="font-medium">{activity.action}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Recorded {relativeTime(activity.created_at)}</p>
            {activity.entity_id ? <p className="mt-1 text-xs text-muted-foreground">Entity ID: {activity.entity_id}</p> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
