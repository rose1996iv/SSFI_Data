"use client";

import { Copy, Mail, MessageCircleMore, Phone, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { buildMailto, buildTelegramLink, buildTel, buildWhatsAppLink } from "@/utils/links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Member } from "@/types/domain";

export function DirectoryGrid({ members }: { members: Member[] }) {
  const { copy } = useCopyToClipboard();

  async function copyValue(value: string, label: string) {
    await copy(value, value);
    toast.success(`${label} copied to clipboard.`);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => {
        const tel = buildTel(member.phone_number);
        const mailto = buildMailto(member.email);
        const whatsapp = buildWhatsAppLink(member.whatsapp || member.phone_number);
        const telegram = buildTelegramLink(member.telegram);

        return (
          <Card key={member.id} className="border-border/70 bg-card/70 backdrop-blur">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={member.profile_image || undefined} alt={member.full_name} />
                  <AvatarFallback name={member.full_name} />
                </Avatar>
                <div>
                  <p className="font-semibold">{member.full_name}</p>
                  <p className="text-sm text-muted-foreground">{member.current_position || "Member"}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{member.university || "University not added"}</p>
                <p>{member.state_in_india || "Location not added"}</p>
                <p>{member.email}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tel ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl">
                      <a href={tel}>
                        <Phone className="size-4" />
                        Call
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-2xl"
                      onClick={() => copyValue(member.phone_number!, "Phone number")}
                    >
                      <Copy className="size-4" />
                      Copy
                    </Button>
                  </>
                ) : null}
                {mailto ? (
                  <Button asChild variant="outline" size="sm" className="rounded-2xl">
                    <a href={mailto}>
                      <Mail className="size-4" />
                      Email
                    </a>
                  </Button>
                ) : null}
                {whatsapp ? (
                  <Button asChild variant="outline" size="sm" className="rounded-2xl">
                    <a href={whatsapp} target="_blank" rel="noreferrer">
                      <MessageCircleMore className="size-4" />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
                {telegram ? (
                  <Button asChild variant="outline" size="sm" className="rounded-2xl">
                    <a href={telegram} target="_blank" rel="noreferrer">
                      <SendHorizonal className="size-4" />
                      Telegram
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
