import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Member } from "@/types/domain";

export function LeadershipForm({
  action,
  members,
}: {
  action: (formData: FormData) => void | Promise<void>;
  members: Member[];
}) {
  return (
    <form action={action}>
      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle>Add leadership record</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="member_id">Member</Label>
            <Select id="member_id" name="member_id" required>
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadership_position">Leadership position</Label>
            <Input id="leadership_position" name="leadership_position" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term_start">Term start</Label>
            <Input id="term_start" name="term_start" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term_end">Term end</Label>
            <Input id="term_end" name="term_end" type="date" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="md:col-span-2">
            <SubmitButton className="rounded-2xl" pendingLabel="Saving record...">
              Save leadership record
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
