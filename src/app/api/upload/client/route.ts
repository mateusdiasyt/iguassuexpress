import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  IMAGE_TYPES,
  MAX_CLIENT_IMAGE_BYTES,
} from "@/lib/upload-shared";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
          throw new Error("Nao autorizado.");
        }

        if (!pathname.startsWith("image/")) {
          throw new Error("Destino de upload invalido.");
        }

        return {
          allowedContentTypes: IMAGE_TYPES,
          maximumSizeInBytes: MAX_CLIENT_IMAGE_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao preparar upload.";
    const status = message === "Nao autorizado." ? 401 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
