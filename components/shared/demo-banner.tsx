import { Database } from "lucide-react";

import { env } from "@/lib/env";

export function DemoBanner() {
  if (env.isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/8 p-4 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/12 p-2 text-primary">
          <Database className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Demo mode is active.</p>
          <p>
            Connect Supabase environment variables to enable live authentication, storage uploads, and database writes.
          </p>
        </div>
      </div>
    </div>
  );
}
