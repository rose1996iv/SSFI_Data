import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Member, PaginatedResult } from "@/types/domain";

export function MemberTable({ result }: { result: PaginatedResult<Member> }) {
  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur">
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile_image || undefined} alt={member.full_name} />
                      <AvatarFallback name={member.full_name} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.university || <Badge variant="outline">Not set</Badge>}</TableCell>
                <TableCell>{member.major || <Badge variant="outline">Not set</Badge>}</TableCell>
                <TableCell>{member.state_in_india || <Badge variant="outline">Not set</Badge>}</TableCell>
                <TableCell>{member.current_position || <Badge variant="outline">Not set</Badge>}</TableCell>
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/members/${member.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
