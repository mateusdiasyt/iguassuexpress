import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import slugify from "slugify";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function safeFileName(name: string) {
  const extension = name.includes(".") ? name.split(".").pop() : "bin";
  const base = slugify(name.replace(/\.[^.]+$/, ""), {
    lower: true,
    strict: true,
    trim: true,
  });

  return `${base || "arquivo"}-${randomUUID()}.${extension}`;
}

async function persistLocally(file: File, folder: string) {
  const fileName = safeFileName(file.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

  return `/uploads/${folder}/${fileName}`;
}

export async function uploadFile(
  file: File,
  kind: "image" | "document" = "image",
) {
  const acceptedTypes = kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES;
  const maxBytes = kind === "image" ? 8 * 1024 * 1024 : 10 * 1024 * 1024;

  if (!acceptedTypes.includes(file.type)) {
    throw new Error("Tipo de arquivo nao suportado.");
  }

  if (file.size > maxBytes) {
    throw new Error("Arquivo acima do tamanho permitido.");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${kind}/${safeFileName(file.name)}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    return blob.url;
  }

  return persistLocally(file, kind === "image" ? "images" : "documents");
}
