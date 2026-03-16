import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import {
  DOCUMENT_TYPES,
  IMAGE_TYPES,
  MAX_DOCUMENT_BYTES,
  MAX_SERVER_IMAGE_BYTES,
  PUBLIC_BLOB_REQUIRED_MESSAGE,
  safeFileName,
} from "@/lib/upload-shared";

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
  const maxBytes = kind === "image" ? MAX_SERVER_IMAGE_BYTES : MAX_DOCUMENT_BYTES;

  if (!acceptedTypes.includes(file.type)) {
    throw new Error("Tipo de arquivo nao suportado.");
  }

  if (file.size > maxBytes) {
    throw new Error("Arquivo acima do tamanho permitido.");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`${kind}/${safeFileName(file.name)}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
      });

      return blob.url;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("private store")
      ) {
        throw new Error(PUBLIC_BLOB_REQUIRED_MESSAGE);
      }

      throw error;
    }
  }

  return persistLocally(file, kind === "image" ? "images" : "documents");
}
