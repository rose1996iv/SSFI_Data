import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DocumentUploadForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action}>
      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle>Upload document</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" defaultValue="reports" required>
              <option value="constitution">Constitution</option>
              <option value="reports">Reports</option>
              <option value="minutes">Meeting minutes</option>
              <option value="events">Event documents</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" required />
          </div>
          <SubmitButton className="rounded-2xl" pendingLabel="Uploading...">
            Upload document
          </SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
