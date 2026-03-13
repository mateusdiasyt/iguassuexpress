import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  getAdminDashboardStats,
  getCareerApplications,
  getContactMessages,
} from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard Admin",
  description: "Resumo do painel administrativo do Iguassu Express Hotel.",
  path: "/admin/dashboard",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const [stats, messages, applications] = await Promise.all([
    getAdminDashboardStats(),
    getContactMessages(),
    getCareerApplications(),
  ]);

  return (
    <AdminShell
      title="Dashboard"
      description="Visao geral rapida dos principais fluxos do site e do painel."
      pathname="/admin/dashboard"
      userName={session.user.name}
    >
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: "Posts", value: stats.posts },
          { label: "Mensagens", value: stats.messages },
          { label: "Candidaturas", value: stats.applications },
          { label: "Quartos", value: stats.rooms },
          { label: "FAQ", value: stats.faqs },
        ].map((item) => (
          <AdminCard key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand/70">
              {item.label}
            </p>
            <p className="mt-4 text-5xl leading-none text-slate-950">{item.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard title="Mensagens recentes" description="Ultimos contatos enviados pelo site.">
          <div className="space-y-4">
            {messages.slice(0, 5).map((message) => (
              <article key={message.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{message.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {format(message.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{message.email}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{message.message}</p>
              </article>
            ))}
            {!messages.length ? (
              <p className="text-sm text-slate-500">Nenhuma mensagem recebida ainda.</p>
            ) : null}
          </div>
        </AdminCard>

        <AdminCard title="Candidaturas recentes" description="Ultimos curriculos enviados pela pagina Carreiras.">
          <div className="space-y-4">
            {applications.slice(0, 5).map((application) => (
              <article key={application.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{application.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {format(application.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {application.job?.title ?? "Banco de talentos"}
                </p>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-brand"
                >
                  Abrir curriculo
                </a>
              </article>
            ))}
            {!applications.length ? (
              <p className="text-sm text-slate-500">Nenhuma candidatura recebida ainda.</p>
            ) : null}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
