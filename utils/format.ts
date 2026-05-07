import { formatDistanceToNow } from "date-fns";

export function relativeTime(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function emptyFallback(value?: string | null, fallback = "Not available") {
  return value && value.trim() ? value : fallback;
}
