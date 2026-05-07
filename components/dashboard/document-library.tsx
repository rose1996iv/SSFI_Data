import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentRecord } from "@/types/domain";

export function DocumentLibrary({ documents }: { documents: DocumentRecord[] }) {
  return (
    <div className="grid gap-4">
      {documents.map((document) => (
        <Card key={document.id} className="border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <FileText className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{document.title}</p>
                  <Badge variant="secondary">{document.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{document.description || document.file_name}</p>
                <p className="text-xs text-muted-foreground">{document.file_name}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="rounded-2xl">
              <a href={`/api/documents/${document.id}/download`}>
                <Download className="size-4" />
                Download
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
