import { Badge } from "@/components/ui/badge";
import type { MemberStatus } from "@/types/domain";

const variants: Record<MemberStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  inactive: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  alumni: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <Badge className={variants[status]} variant="secondary">
      {status}
    </Badge>
  );
}
