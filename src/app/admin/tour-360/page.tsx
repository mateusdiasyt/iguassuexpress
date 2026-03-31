import type { ReactNode } from "react";
import Image from "next/image";
import { Compass, ImageIcon, Orbit } from "lucide-react";
import { saveTour360Action } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { TourScenesField } from "@/components/admin/tour/tour-scenes-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getTour360Content } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tour 360 Admin",
  description: "Gestao das cenas panoramicas e dos textos do tour 360.",
  path: "/admin/tour-360",
  noIndex: true,
});

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function MetricPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
      {children}
    </span>
  );
}

function DetailCard({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Compass;
}) {
  return (
    <article className="rounded-[1.25rem] border border-slate-200/80 bg-white/75 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </article>
  );
}

export default async function AdminTourPage() {
  const session = await requireAdmin();
  const tour = await getTour360Content();
  const coverScene = tour.scenes[0] ?? null;

  return (
    <AdminShell
      title="Tour 360"
      description="Organize as cenas panoramicas do hotel com a mesma logica visual usada no site."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Experiencia panoramica</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Tour 360
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <MetricPill>{tour.scenes.length} cenas</MetricPill>
            <MetricPill>{coverScene ? "capa definida" : "sem capa"}</MetricPill>
            <MetricPill>Home + modal + pagina</MetricPill>
          </div>
        </div>

        <form action={saveTour360Action} className="space-y-5">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-[1.9rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <SectionEyebrow>Abertura do tour</SectionEyebrow>
                  <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950">
                    Texto principal da experiencia
                  </h2>
                </div>

                <MetricPill>{coverScene?.title ?? "Sem cena principal"}</MetricPill>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Titulo</span>
                  <Input name="title" defaultValue={tour.title} />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Descricao</span>
                  <Textarea
                    className="min-h-40"
                    name="description"
                    defaultValue={tour.description}
                  />
                </label>
              </div>
            </article>

            <aside className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,249,252,0.94)_100%)] p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <SectionEyebrow>Preview atual</SectionEyebrow>
              <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950">
                {coverScene?.title ?? "Defina a capa do tour"}
              </h2>

              <div className="mt-5 overflow-hidden rounded-[1.55rem] border border-slate-200/80 bg-slate-100">
                {coverScene?.image ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={coverScene.image}
                      alt={coverScene.title}
                      fill
                      className="object-cover"
                      sizes="360px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                    <div className="absolute inset-x-4 bottom-4">
                      <span className="rounded-full border border-white/30 bg-white/18 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                        Cena de abertura
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center px-6 text-center text-sm leading-6 text-slate-400">
                    A primeira cena cadastrada vira a capa do tour na Home.
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <DetailCard
                  eyebrow="Hierarquia"
                  title="Cena 1 = capa principal"
                  description="A primeira cena aparece na Home e abre a experiencia completa do tour."
                  icon={ImageIcon}
                />
                <DetailCard
                  eyebrow="Navegacao"
                  title="Nome visivel no site"
                  description="O nome cadastrado aqui aparece no modal e na pagina dedicada do tour."
                  icon={Orbit}
                />
                <DetailCard
                  eyebrow="Formato"
                  title="Panorama em 2:1"
                  description="Fotos equiretangulares entregam um giro mais natural e proximo do Street View."
                  icon={Compass}
                />
              </div>
            </aside>
          </section>

          <section className="rounded-[1.9rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <SectionEyebrow>Cenas panoramicas</SectionEyebrow>
                <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950">
                  Estrutura do tour
                </h2>
              </div>

              <MetricPill>{tour.scenes.length} cadastradas</MetricPill>
            </div>

            <div className="mt-5">
              <TourScenesField name="scenes" defaultValue={tour.scenes} />
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-slate-500">
              As alteracoes salvam a capa da Home, o modal e a pagina completa do Tour 360.
            </p>
            <SubmitButton className="sm:w-auto">Salvar tour 360</SubmitButton>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
