import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin | Iguassu Express Hotel",
  description: "Entrada principal do painel administrativo do Iguassu Express Hotel.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminEntryPage() {
  const session = await getSession();

  redirect(session?.user?.id ? "/admin/dashboard" : "/admin/login");
}
