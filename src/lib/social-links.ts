import { formatWhatsAppHref } from "@/lib/utils";

export type SocialLinks = {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
};

function readStringField(value: unknown, key: keyof SocialLinks) {
  if (!value || typeof value !== "object" || !(key in value)) {
    return "";
  }

  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field.trim() : "";
}

export function normalizeExternalUrl(value?: string | null) {
  const raw = value?.trim() ?? "";

  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw) || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return raw;
  }

  if (raw.startsWith("www.")) {
    return `https://${raw}`;
  }

  return raw;
}

export function getSocialLinks(value: unknown): SocialLinks {
  return {
    whatsapp: readStringField(value, "whatsapp"),
    instagram: readStringField(value, "instagram"),
    facebook: readStringField(value, "facebook"),
    youtube: readStringField(value, "youtube"),
  };
}

export function resolveWhatsAppSocialHref(
  socialWhatsapp: string | undefined,
  fallbackPhone: string,
  message = "Olá! Gostaria de fazer uma reserva.",
) {
  const raw = socialWhatsapp?.trim();

  if (!raw) {
    return formatWhatsAppHref(fallbackPhone, message);
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return formatWhatsAppHref(raw, message);
}
