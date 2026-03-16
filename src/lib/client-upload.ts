"use client";

import { upload } from "@vercel/blob/client";
import {
  MAX_CLIENT_IMAGE_BYTES,
  MAX_DOCUMENT_BYTES,
  MAX_SERVER_IMAGE_BYTES,
  PUBLIC_BLOB_REQUIRED_MESSAGE,
  safeFileName,
} from "@/lib/upload-shared";

type UploadKind = "image" | "document";

async function readErrorMessage(response: Response) {
  const text = await response.text();

  try {
    const json = JSON.parse(text) as { error?: string };
    return json.error ?? `Falha no upload (${response.status}).`;
  } catch {
    if (response.status === 413) {
      return "Arquivo grande demais para este fluxo. Tente novamente ou use upload direto no Blob.";
    }

    return text || `Falha no upload (${response.status}).`;
  }
}

async function uploadThroughServer(file: File, kind: UploadKind) {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);

  const response = await fetch("/api/upload", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const json = (await response.json()) as { url?: string; error?: string };

  if (!json.url) {
    throw new Error(json.error ?? "Falha no upload.");
  }

  return json.url;
}

function normalizeDirectUploadError(error: unknown) {
  if (!(error instanceof Error)) {
    return new Error("Falha no upload direto para o Blob.");
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("cannot use public access on a private store") ||
    message.includes("store is configured with private access") ||
    message.includes("failed to fetch") ||
    message.includes("load failed")
  ) {
    return new Error(PUBLIC_BLOB_REQUIRED_MESSAGE);
  }

  return error;
}

export async function uploadAssetFromClient(file: File, kind: UploadKind = "image") {
  if (kind === "document") {
    if (file.size > MAX_DOCUMENT_BYTES) {
      throw new Error("Arquivo acima do tamanho permitido.");
    }

    return uploadThroughServer(file, kind);
  }

  if (file.size > MAX_CLIENT_IMAGE_BYTES) {
    throw new Error("Imagem acima do tamanho permitido para a galeria 360.");
  }

  try {
    const blob = await upload(`image/${safeFileName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload/client",
      contentType: file.type,
      multipart: file.size > MAX_SERVER_IMAGE_BYTES,
    });

    return blob.url;
  } catch (error) {
    if (file.size <= MAX_SERVER_IMAGE_BYTES) {
      return uploadThroughServer(file, kind);
    }

    throw normalizeDirectUploadError(error);
  }
}
