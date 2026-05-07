const appName = process.env.NEXT_PUBLIC_APP_NAME || "SSFI Data Center";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const env = {
  appName,
  siteUrl,
  supabaseUrl,
  supabaseAnonKey,
  serviceRoleKey,
  memberBucket: process.env.SUPABASE_STORAGE_MEMBER_BUCKET || "member-assets",
  documentBucket: process.env.SUPABASE_STORAGE_DOCUMENT_BUCKET || "organization-documents",
  defaultSuperAdminEmail: process.env.DEFAULT_SUPER_ADMIN_EMAIL || "admin@ssfi.org",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20),
  isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  isServiceRoleConfigured: Boolean(supabaseUrl && serviceRoleKey),
};
