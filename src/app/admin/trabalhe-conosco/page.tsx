import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  deleteCareerJobAction,
  saveCareerJobAction,
} from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getCareerApplications, getCareerJobs } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Carreiras Admin",
  description: "Gestao de vagas e candidaturas do hotel.",
  path: "/admin/trabalhe-conosco",
  noIndex: true,
});

export default async function AdminCareersPage() {
  const session = await requireAdmin();
  const [jobs, applications] = await Promise.all([
    getCareerJobs(true),
    getCareerApplications(),
  ]);

  return (
    <AdminShell
      title="Carreiras"
      description="Controle vagas ativas, edite descricoes e acompanhe os curriculos recebidos."
      pathname="/admin/trabalhe-conosco"
      userName={session.user.name}
    >
      <AdminCard title="Nova vaga">
        <form action={saveCareerJobAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo
              <Input name="title" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Slug
              <Input name="slug" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Ordem
              <Input name="order" type="number" defaultValue="0" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" name="isActive" defaultChecked />
              Vaga ativa
            </label>
          </div>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao
            <Textarea name="description" />
          </label>
          <div>
            <SubmitButton>Adicionar vaga</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          {jobs.map((job) => (
            <AdminCard key={job.id} title={job.title}>
              <form action={saveCareerJobAction} className="grid gap-4">
                <input type="hidden" name="id" value={job.id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    Titulo
                    <Input name="title" defaultValue={job.title} />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    Slug
                    <Input name="slug" defaultValue={job.slug} />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    Ordem
                    <Input name="order" type="number" defaultValue={job.order} />
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <input type="checkbox" name="isActive" defaultChecked={job.isActive} />
                    Vaga ativa
                  </label>
                </div>
                <label className="grid gap-2 text-sm text-slate-600">
                  Descricao
                  <Textarea name="description" defaultValue={job.description} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <SubmitButton>Salvar vaga</SubmitButton>
                </div>
              </form>
              <form action={deleteCareerJobAction} className="mt-4">
                <input type="hidden" name="id" value={job.id} />
                <button type="submit" className="text-sm font-semibold text-red-500">
                  Excluir vaga
                </button>
              </form>
            </AdminCard>
          ))}
        </div>

        <AdminCard title="Candidaturas recebidas">
          <div className="space-y-4">
            {applications.map((application) => (
              <article key={application.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{application.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {format(application.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{application.email}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {application.job?.title ?? "Banco de talentos"}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{application.message}</p>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-brand"
                >
                  Baixar curriculo
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
