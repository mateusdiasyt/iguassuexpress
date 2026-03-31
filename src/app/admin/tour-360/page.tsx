import { saveTour360Action } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadGalleryField } from "@/components/admin/upload-gallery-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getTour360Content } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tour 360 Admin",
  description: "Gestao das fotos panoramicas e dos textos do tour 360.",
  path: "/admin/tour-360",
  noIndex: true,
});

export default async function AdminTourPage() {
  const session = await requireAdmin();
  const tour = await getTour360Content();

  return (
    <AdminShell
      title="Tour 360"
      description="Atualize o texto da experiencia e publique as fotos panoramicas que vao alimentar o viewer 360 do site."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <AdminCard
        title="Fotos 360 do hotel"
        description="A primeira imagem vira a capa do preview na Home e as demais entram como cenas no modal e na pagina completa."
        className="mx-auto w-full max-w-6xl"
      >
        <form action={saveTour360Action} className="space-y-6">
          <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[1.6rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(246,249,252,0.9)_100%)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                Guia rapido
              </p>
              <h3 className="mt-3 text-2xl leading-tight font-bold text-slate-950">
                Viewer 360 com fotos panoramicas
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Use fotos 360 reais no formato panoramico equiretangular, de preferencia em proporcao 2:1.
                </p>
                <p>
                  A primeira cena fica em destaque na Home. As demais entram no popup e na pagina completa do tour.
                </p>
                <p>
                  O visitante nao caminha entre pontos: ele apenas gira a cena, como um Street View estatico.
                </p>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="grid gap-4 rounded-[1.6rem] border border-brand/10 bg-slate-50/70 p-4">
                <label className="grid gap-2 text-sm text-slate-600">
                  Titulo
                  <Input name="title" defaultValue={tour.title} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Descricao
                  <Textarea className="min-h-28" name="description" defaultValue={tour.description} />
                </label>
              </section>

              <section className="rounded-[1.6rem] border border-brand/10 bg-white p-4">
                <UploadGalleryField
                  name="gallery"
                  label="Cenas panoramicas 360"
                  defaultValue={tour.gallery}
                />
              </section>
            </div>
          </section>

          <div className="flex justify-end rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
            <SubmitButton className="sm:w-auto">Salvar tour 360</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
