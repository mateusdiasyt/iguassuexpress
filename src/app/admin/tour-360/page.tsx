import { saveTour360Action } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadGalleryField } from "@/components/admin/upload-gallery-field";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getTour360Content } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tour 360 Admin",
  description: "Gestao do embed e dos textos do tour 360.",
  path: "/admin/tour-360",
  noIndex: true,
});

export default async function AdminTourPage() {
  const session = await requireAdmin();
  const tour = await getTour360Content();

  return (
    <AdminShell
      title="Tour 360"
      description="Atualize titulo, descricao, embed, banner e a galeria de cenas do tour virtual."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <AdminCard
        title="Conteudo do tour 360"
        description="Painel minimalista para configurar a cena principal e a galeria panoramica."
        className="mx-auto w-full max-w-6xl"
      >
        <form action={saveTour360Action} className="space-y-6">
          <section className="grid gap-4 rounded-[1.6rem] border border-brand/10 bg-slate-50/70 p-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo
              <Input name="title" defaultValue={tour.title} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Embed URL
              <Input name="embedUrl" defaultValue={tour.embedUrl ?? ""} placeholder="https://..." />
            </label>
            <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
              Descricao
              <Textarea className="min-h-28" name="description" defaultValue={tour.description} />
            </label>
          </section>

          <section className="grid gap-5 rounded-[1.6rem] border border-brand/10 bg-white p-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
            <UploadField
              name="heroImage"
              label="Imagem principal"
              defaultValue={tour.heroImage}
              inputClassName="max-w-md"
              previewClassName="h-40 w-full max-w-md p-2"
              previewImageClassName="object-contain"
            />
            <div className="rounded-2xl border border-brand/10 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/70">
                Preview da thumb
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A imagem aparece inteira com proporcao preservada para evitar cortes no enquadramento.
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Dica: para melhor resultado, use panoramicas em alta resolucao e pouco texto sobreposto.
              </p>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-brand/10 bg-white p-4">
            <UploadGalleryField
              name="gallery"
              label="Galeria 360"
              defaultValue={tour.gallery}
            />
          </section>

          <div className="flex flex-col gap-3 rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" name="isActive" defaultChecked={tour.isActive} />
              Tour ativo
            </label>
            <SubmitButton className="sm:w-auto">Salvar tour 360</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
