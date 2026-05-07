export function buildWhatsAppLink(phone?: string | null) {
  if (!phone) return null;
  const normalized = phone.replace(/[^\d+]/g, "");
  return `https://wa.me/${normalized.replace(/^\+/, "")}`;
}

export function buildTelegramLink(handle?: string | null) {
  if (!handle) return null;
  const normalized = handle.replace(/^@/, "");
  return `https://t.me/${normalized}`;
}

export function buildMailto(email?: string | null) {
  return email ? `mailto:${email}` : null;
}

export function buildTel(phone?: string | null) {
  return phone ? `tel:${phone}` : null;
}
