import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Login Admin",
  description: "Acesso protegido ao painel do Iguassu Express Hotel.",
  path: "/admin/login",
  noIndex: true,
});

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session?.user?.id) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(9,77,122,0.28),transparent_30%),linear-gradient(180deg,#08233a_0%,#061728_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
            Iguassu Express Hotel
          </p>
          <h1 className="text-6xl leading-none md:text-7xl">
            Painel administrativo profissional e seguro.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-white/72">
            Acesse para gerenciar paginas, quartos, restaurante, SEO, blog, FAQ e candidaturas em um fluxo centralizado.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
