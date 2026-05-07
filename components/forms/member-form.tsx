import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Member } from "@/types/domain";

function defaultValue(value?: string | number | null) {
  return value ?? "";
}

export function MemberForm({
  action,
  member,
}: {
  action: (formData: FormData) => void | Promise<void>;
  member?: Member | null;
}) {
  return (
    <form action={action} className="space-y-6">
      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="profile_image">Profile image</Label>
            <Input id="profile_image" name="profile_image" type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" defaultValue={defaultValue(member?.full_name)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={defaultValue(member?.email)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" name="gender" defaultValue={defaultValue(member?.gender)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of birth</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={defaultValue(member?.date_of_birth)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone number</Label>
            <Input id="phone_number" name="phone_number" defaultValue={defaultValue(member?.phone_number)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={defaultValue(member?.whatsapp)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input id="telegram" name="telegram" defaultValue={defaultValue(member?.telegram)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village_in_myanmar">Village in Myanmar</Label>
            <Input id="village_in_myanmar" name="village_in_myanmar" defaultValue={defaultValue(member?.village_in_myanmar)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_city_in_india">Current city in India</Label>
            <Input id="current_city_in_india" name="current_city_in_india" defaultValue={defaultValue(member?.current_city_in_india)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state_in_india">State in India</Label>
            <Input id="state_in_india" name="state_in_india" defaultValue={defaultValue(member?.state_in_india)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input id="university" name="university" defaultValue={defaultValue(member?.university)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input id="major" name="major" defaultValue={defaultValue(member?.major)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Batch</Label>
            <Input id="batch" name="batch" defaultValue={defaultValue(member?.batch)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_joined">Year joined</Label>
            <Input id="year_joined" name="year_joined" type="number" defaultValue={defaultValue(member?.year_joined)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_position">Current position</Label>
            <Input id="current_position" name="current_position" defaultValue={defaultValue(member?.current_position)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={defaultValue(member?.status || "active")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={defaultValue(member?.bio)} />
          </div>
        </CardContent>
      </Card>
      <SubmitButton className="rounded-2xl" pendingLabel="Saving member...">
        {member ? "Update member" : "Create member"}
      </SubmitButton>
    </form>
  );
}
