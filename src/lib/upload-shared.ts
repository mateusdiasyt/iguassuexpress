import slugify from "slugify";

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_SERVER_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_CLIENT_IMAGE_BYTES = 100 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export function safeFileName(name: string) {
  const extension = name.includes(".") ? name.split(".").pop() : "bin";
  const base = slugify(name.replace(/\.[^.]+$/, ""), {
    lower: true,
    strict: true,
    trim: true,
  });

  return `${base || "arquivo"}-${crypto.randomUUID()}.${extension}`;
}
