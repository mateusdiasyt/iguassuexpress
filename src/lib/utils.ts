import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function parseList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyJson(value: unknown) {
  return value ? JSON.stringify(value, null, 2) : "";
}

export function safeParseJson<T>(value: string, fallback: T): T {
  if (!value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getContentBody(value: unknown) {
  if (!value || typeof value !== "object") {
    return "";
  }

  if ("body" in value && typeof value.body === "string") {
    return value.body;
  }

  return "";
}

export function getHeroCards(value: unknown) {
  const fallbackCards = [
    {
      title: "Pet friendly",
      description: "Hospedagem acolhedora para quem viaja com seu pet e quer mais praticidade.",
    },
  ];

  if (!value || typeof value !== "object" || !("heroCards" in value)) {
    return [];
  }

  const cards = value.heroCards;

  if (!Array.isArray(cards)) {
    return [];
  }

  const normalizedCards = cards.filter(
    (card): card is { title: string; description: string } =>
      Boolean(card) &&
      typeof card === "object" &&
      "title" in card &&
      typeof card.title === "string" &&
      "description" in card &&
      typeof card.description === "string",
  );

  const hasPetFriendlyCard = normalizedCards.some((card) =>
    card.title.trim().toLowerCase().includes("pet"),
  );

  return hasPetFriendlyCard ? normalizedCards : [...normalizedCards, ...fallbackCards];
}

export function absoluteUrl(path = "/") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatPhoneHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function formatWhatsAppHref(phone: string, message?: string) {
  const normalized = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${text}`;
}
