import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { uploadFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind") === "document" ? "document" : "image";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Arquivo invalido." }, { status: 400 });
  }

  try {
    const url = await uploadFile(file, kind);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha no upload.",
      },
      { status: 400 },
    );
  }
}
