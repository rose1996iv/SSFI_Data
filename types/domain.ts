export const appRoles = [
  "super_admin",
  "admin",
  "executive",
  "member",
  "alumni",
  "guest",
] as const;

export const memberStatuses = ["active", "inactive", "alumni"] as const;

export type AppRole = (typeof appRoles)[number];
export type MemberStatus = (typeof memberStatuses)[number];

export type RoleOption = {
  id: string;
  name: string;
  key: AppRole;
  description: string;
};

export type Member = {
  id: string;
  user_id?: string | null;
  profile_image?: string | null;
  full_name: string;
  gender?: string | null;
  date_of_birth?: string | null;
  phone_number?: string | null;
  email: string;
  whatsapp?: string | null;
  telegram?: string | null;
  village_in_myanmar?: string | null;
  current_city_in_india?: string | null;
  state_in_india?: string | null;
  university?: string | null;
  major?: string | null;
  batch?: string | null;
  year_joined?: number | null;
  current_position?: string | null;
  bio?: string | null;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
};

export type LeadershipRecord = {
  id: string;
  member_id: string;
  leadership_position: string;
  term_start: string;
  term_end?: string | null;
  description?: string | null;
  created_at: string;
  member?: Pick<Member, "id" | "full_name" | "profile_image" | "current_position" | "email">;
};

export type GraduateRecord = {
  id: string;
  member_id: string;
  degree: string;
  graduation_date?: string | null;
  graduation_year: number;
  university: string;
  current_job?: string | null;
  current_country?: string | null;
  current_city?: string | null;
  company?: string | null;
  linkedin_url?: string | null;
  created_at: string;
  updated_at: string;
  member?: Pick<Member, "id" | "full_name" | "profile_image" | "email" | "phone_number">;
};

export type DocumentRecord = {
  id: string;
  title: string;
  description?: string | null;
  category: "constitution" | "reports" | "minutes" | "events" | "other";
  file_path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  uploaded_by?: string | null;
  created_at: string;
};

export type ActivityRecord = {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
  created_at: string;
};

export type NotificationRecord = {
  id: string;
  user_id: string;
  title: string;
  body?: string | null;
  href?: string | null;
  read_at?: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  display_name?: string | null;
  role: AppRole;
  role_label: string;
  member_id?: string | null;
};

export type DashboardMetric = {
  label: string;
  value: number;
  helper: string;
  trend?: number;
};

export type ChartDatum = {
  label: string;
  value: number;
};

export type DashboardSnapshot = {
  metrics: DashboardMetric[];
  membersByState: ChartDatum[];
  membersByUniversity: ChartDatum[];
  membersByMajor: ChartDatum[];
  graduationStats: ChartDatum[];
  activeLeaders: LeadershipRecord[];
  recentMembers: Member[];
  recentDocuments: DocumentRecord[];
};

export type MemberFilters = {
  query?: string;
  university?: string;
  major?: string;
  village?: string;
  state?: string;
  batch?: string;
  position?: string;
  status?: MemberStatus | "all";
  page?: number;
  pageSize?: number;
  sort?: "full_name.asc" | "full_name.desc" | "created_at.desc" | "year_joined.desc";
};

export type GraduateFilters = {
  query?: string;
  graduationYear?: number;
  university?: string;
};

export type DocumentFilters = {
  query?: string;
  category?: DocumentRecord["category"] | "all";
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
