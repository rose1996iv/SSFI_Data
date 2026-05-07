import { z } from "zod";

import { appRoles, memberStatuses } from "@/types/domain";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const memberSchema = z.object({
  full_name: z.string().min(3, "Full name is required."),
  email: z.email("Enter a valid email address."),
  gender: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  village_in_myanmar: z.string().optional().nullable(),
  current_city_in_india: z.string().optional().nullable(),
  state_in_india: z.string().optional().nullable(),
  university: z.string().optional().nullable(),
  major: z.string().optional().nullable(),
  batch: z.string().optional().nullable(),
  year_joined: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
  current_position: z.string().optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  status: z.enum(memberStatuses),
});

export const leadershipSchema = z.object({
  member_id: z.uuid("Select a valid member."),
  leadership_position: z.string().min(2),
  term_start: z.string().min(1),
  term_end: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

export const graduateSchema = z.object({
  member_id: z.uuid("Select a valid member."),
  degree: z.string().min(2),
  graduation_date: z.string().optional().nullable(),
  graduation_year: z.coerce.number().int().min(1990).max(2100),
  university: z.string().min(2),
  current_job: z.string().optional().nullable(),
  current_country: z.string().optional().nullable(),
  current_city: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  linkedin_url: z.url().optional().nullable().or(z.literal("")),
});

export const documentSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(1000).optional().nullable(),
  category: z.enum(["constitution", "reports", "minutes", "events", "other"]),
});

export const userRoleSchema = z.object({
  role: z.enum(appRoles),
});
