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
  description: "Gestao da galeria panoramica e dos textos do tour 360.",
  path: "/admin/tour-360",
  noIndex: true,
});

export default async function AdminTourPage() {
  const session = await requireAdmin();
  const tour = await getTour360Content();

  return (
    <AdminShell
      title="Tour 360"
      description="Atualize titulo, descricao e a hierarquia das cenas panoramicas do tour virtual."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <AdminCard
        title="Conteudo do tour 360"
        description="Painel minimalista para gerenciar a experiencia 360 com ordem de prioridade das cenas."
        className="mx-auto w-full max-w-6xl"
      >
        <form action={saveTour360Action} className="space-y-6">
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
              label="Galeria 360"
              defaultValue={tour.gallery}
            />
          </section>

          <div className="flex justify-end rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
            <SubmitButton className="sm:w-auto">Salvar tour 360</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
