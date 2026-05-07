import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { DashboardMetric } from "@/types/domain";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const isPositive = (metric.trend || 0) >= 0;

  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur">
      <CardContent className="space-y-3 p-6">
        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-semibold">{formatNumber(metric.value)}</p>
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isPositive ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
            }`}
          >
            {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {metric.trend ?? 0}%
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{metric.helper}</p>
      </CardContent>
    </Card>
  );
}
