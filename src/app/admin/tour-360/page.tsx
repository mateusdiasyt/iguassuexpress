import { saveTour360Action } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
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

export default async function AdminTourPage() {
  const session = await requireAdmin();
  const tour = await getTour360Content();

  return (
    <AdminShell
      title="Tour 360"
      description="Organize as cenas panoramicas do hotel, defina nomes claros e mantenha a experiencia 360 pronta para o site."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <AdminCard
        title="Editor de cenas 360"
        description="Uma estrutura mais simples para cuidar do texto geral e das fotos panoramicas que entram na Home, no modal e na pagina completa."
        className="mx-auto w-full max-w-[1180px]"
      >
        <form action={saveTour360Action} className="space-y-6">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.95fr)]">
            <section className="grid gap-4 rounded-[1.8rem] border border-brand/10 bg-white/90 p-5 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
              <div className="space-y-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                  Conteudo principal
                </p>
                <h3 className="text-2xl font-bold text-slate-950">Abertura do tour</h3>
              </div>

              <label className="grid gap-2 text-sm text-slate-600">
                Titulo
                <Input name="title" defaultValue={tour.title} />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                Descricao
                <Textarea
                  className="min-h-36"
                  name="description"
                  defaultValue={tour.description}
                />
              </label>
            </section>

            <aside className="rounded-[1.8rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(245,249,252,0.96)_0%,rgba(255,255,255,0.98)_100%)] p-6 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                Como funciona
              </p>
              <h3 className="mt-3 text-[2rem] leading-tight font-bold text-slate-950">
                Cenas nomeadas e prontas para o site
              </h3>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Cada imagem panoramica vira uma cena com nome proprio. Esse nome aparece no modal e na pagina dedicada do tour.
                </p>
                <p>
                  A primeira cena da lista vira a capa da Home e o ponto inicial da experiencia.
                </p>
                <p>
                  Para um giro mais natural, prefira fotos 360 equiretangulares na proporcao 2:1.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[1.3rem] border border-brand/10 bg-white/80 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                    Cenas atuais
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{tour.scenes.length}</p>
                </div>
                <div className="rounded-[1.3rem] border border-brand/10 bg-white/80 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                    Estrutura
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Nome + descricao + imagem panoramica em uma mesma hierarquia visual.
                  </p>
                </div>
              </div>
            </aside>
          </section>

          <section className="rounded-[1.8rem] border border-brand/10 bg-white p-5 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
            <TourScenesField name="scenes" defaultValue={tour.scenes} />
          </section>

          <div className="flex justify-end rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
            <SubmitButton className="sm:w-auto">Salvar tour 360</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
