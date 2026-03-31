import type { ReactNode } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownToLine,
  BriefcaseBusiness,
  ChevronDown,
  Inbox,
  Mail,
  Plus,
} from "lucide-react";
import {
  deleteCareerJobAction,
  saveCareerJobAction,
} from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
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

type CareerJobs = Awaited<ReturnType<typeof getCareerJobs>>;
type CareerJob = CareerJobs[number];
type CareerApplications = Awaited<ReturnType<typeof getCareerApplications>>;
type CareerApplication = CareerApplications[number];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function MetricCard({
  eyebrow,
  value,
  label,
}: {
  eyebrow: string;
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/70 bg-white/88 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </article>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-500",
      ].join(" ")}
    >
      {active ? "Ativa" : "Inativa"}
    </span>
  );
}

function InlineToggle({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
        <span
          aria-hidden="true"
          className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]"
        />
      </span>
    </label>
  );
}

function CreateJobPanel({ nextOrder }: { nextOrder: number }) {
  return (
    <details className="group rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50/80 [&::-webkit-details-marker]:hidden">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
          <Plus className="h-4 w-4 transition group-open:rotate-45" />
        </span>
        <span>Adicionar vaga</span>
      </summary>

      <form action={saveCareerJobAction} className="mt-4 grid gap-4 px-1 pb-1">
        <input type="hidden" name="order" value={nextOrder} />
        <input type="hidden" name="isActive" value="true" />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Titulo</span>
            <Input name="title" placeholder="Ex.: Recepcionista" />
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Ordem</span>
            <Input name="orderPreview" type="number" defaultValue={nextOrder + 1} disabled />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
            <span className="font-medium text-slate-950">Slug</span>
            <Input name="slug" placeholder="Pode deixar em branco para gerar automaticamente" />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
            <span className="font-medium text-slate-950">Descricao</span>
            <Textarea
              name="description"
              className="min-h-[140px]"
              placeholder="Descreva responsabilidades, perfil esperado e o contexto da vaga."
            />
          </label>
        </div>

        <div className="flex justify-end rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
          <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
            Adicionar
          </SubmitButton>
        </div>
      </form>
    </details>
  );
}

function JobEditorCard({ job, index }: { job: CareerJob; index: number }) {
  const deleteFormId = `delete-career-job-${job.id}`;

  return (
    <details className="group rounded-[1.8rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.35rem] border border-slate-200 bg-slate-50/60 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
            <BriefcaseBusiness className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <SectionEyebrow>Vaga {String(index + 1).padStart(2, "0")}</SectionEyebrow>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {job.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ordem {job.order + 1}
          </span>
          <StatusPill active={job.isActive} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-open:rotate-180 group-open:text-slate-700">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </summary>

      <form action={saveCareerJobAction} className="mt-4 grid gap-4">
        <input type="hidden" name="id" value={job.id} />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Titulo</span>
            <Input name="title" defaultValue={job.title} />
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Ordem</span>
            <Input name="order" type="number" defaultValue={job.order} />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
            <span className="font-medium text-slate-950">Slug</span>
            <Input name="slug" defaultValue={job.slug} />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
            <span className="font-medium text-slate-950">Descricao</span>
            <Textarea name="description" className="min-h-[150px]" defaultValue={job.description} />
          </label>
        </div>

        <InlineToggle name="isActive" defaultChecked={job.isActive} label="Vaga visivel no site" />

        <div className="flex flex-wrap justify-end gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
          <Button
            type="submit"
            form={deleteFormId}
            variant="outline"
            className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
          >
            Excluir
          </Button>
          <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
            Salvar
          </SubmitButton>
        </div>
      </form>

      <form id={deleteFormId} action={deleteCareerJobAction}>
        <input type="hidden" name="id" value={job.id} />
      </form>
    </details>
  );
}

function ApplicationCard({ application }: { application: CareerApplication }) {
  return (
    <article className="rounded-[1.45rem] border border-slate-200/80 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-950">{application.name}</h3>
          <a
            href={`mailto:${application.email}`}
            className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-950"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{application.email}</span>
          </a>
        </div>

        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {format(application.createdAt, "dd/MM/yyyy", { locale: ptBR })}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {application.job?.title ?? "Banco de talentos"}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{application.message}</p>

      <a
        href={application.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-100/80"
      >
        <ArrowDownToLine className="h-4 w-4" />
        Baixar curriculo
      </a>
    </article>
  );
}

export default async function AdminCareersPage() {
  const session = await requireAdmin();
  const [jobs, applications] = await Promise.all([
    getCareerJobs(true),
    getCareerApplications(),
  ]);

  const activeJobs = jobs.filter((job) => job.isActive).length;
  const inactiveJobs = jobs.length - activeJobs;
  const nextJobOrder = jobs.length ? Math.max(...jobs.map((job) => job.order)) + 1 : 0;

  return (
    <AdminShell
      title="Carreiras"
      description="Controle vagas ativas, edite descricoes e acompanhe os curriculos recebidos."
      pathname="/admin/trabalhe-conosco"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Trabalhe conosco</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Vagas e candidaturas
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
              {jobs.length} {jobs.length === 1 ? "vaga" : "vagas"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
              {applications.length} {applications.length === 1 ? "candidatura" : "candidaturas"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard eyebrow="Total" value={String(jobs.length)} label="Vagas cadastradas" />
          <MetricCard eyebrow="Ativas" value={String(activeJobs)} label="Exibidas no site" />
          <MetricCard eyebrow="Inativas" value={String(inactiveJobs)} label="Ocultas no momento" />
        </div>

        <CreateJobPanel nextOrder={nextJobOrder} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <section className="space-y-4">
            <div className="rounded-[1.8rem] border border-white/70 bg-white/90 px-5 py-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <SectionEyebrow>Vagas</SectionEyebrow>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  Lista de vagas
                </h2>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                  Abra um card para editar
                </span>
              </div>
            </div>

            {jobs.length ? (
              jobs.map((job, index) => <JobEditorCard key={job.id} job={job} index={index} />)
            ) : (
              <article className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <SectionEyebrow>Sem vagas</SectionEyebrow>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  Nenhuma vaga cadastrada ainda
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Use o botao acima para publicar a primeira oportunidade.
                </p>
              </article>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Inbox className="h-4.5 w-4.5" />
                </span>
                <div>
                  <SectionEyebrow>Candidaturas</SectionEyebrow>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    Curriculos recebidos
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {applications.length ? (
                  applications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))
                ) : (
                  <article className="rounded-[1.45rem] border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
                    <SectionEyebrow>Vazio</SectionEyebrow>
                    <p className="mt-2 text-sm text-slate-500">
                      Nenhuma candidatura recebida ainda.
                    </p>
                  </article>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </AdminShell>
  );
}
