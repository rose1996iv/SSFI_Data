import { FileSearch } from "lucide-react";

import { DocumentLibrary } from "@/components/dashboard/document-library";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { listDocuments } from "@/services/document.service";
import { uploadDocumentAction } from "@/services/document.actions";

export default async function DocumentsPage() {
  const documents = await listDocuments();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Documents"
        title="Document management"
        description="Upload constitutions, reports, meeting minutes, and other official files into secure Supabase storage with structured metadata."
      />
      <DocumentUploadForm action={uploadDocumentAction} />
      {documents.length ? (
        <DocumentLibrary documents={documents} />
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No documents uploaded"
          body="Upload the first official file to begin the SSFI document archive."
        />
      )}
    </div>
  );
}
