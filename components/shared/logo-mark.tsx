import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-cyan-500 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20",
        className,
      )}
    >
      SS
    </div>
  );
}
