import { listDocuments } from "@/services/document.service";
import { listMembers } from "@/services/member.service";

export async function globalSearch(query: string) {
  const [members, documents] = await Promise.all([
    listMembers({ query, page: 1, pageSize: 6, sort: "full_name.asc" }),
    listDocuments({ query }),
  ]);

  return {
    members: members.data,
    documents: documents.slice(0, 6),
  };
}
