import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Member } from "@/types/domain";

export function GraduateForm({
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
          <CardTitle>Add graduate record</CardTitle>
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
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" name="degree" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation_year">Graduation year</Label>
            <Input id="graduation_year" name="graduation_year" type="number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation_date">Graduation date</Label>
            <Input id="graduation_date" name="graduation_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input id="university" name="university" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_job">Current job</Label>
            <Input id="current_job" name="current_job" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_country">Current country</Label>
            <Input id="current_country" name="current_country" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_city">Current city</Label>
            <Input id="current_city" name="current_city" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input id="linkedin_url" name="linkedin_url" type="url" />
          </div>
          <div className="md:col-span-2">
            <SubmitButton className="rounded-2xl" pendingLabel="Saving record...">
              Save graduate record
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
