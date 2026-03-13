import { deleteGalleryImageAction, saveGalleryImageAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getGalleryImages } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Galeria Admin",
  description: "Upload, ordenacao e alt text SEO da galeria.",
  path: "/admin/galeria",
  noIndex: true,
});

export default async function AdminGalleryPage() {
  const session = await requireAdmin();
  const images = await getGalleryImages();

  return (
    <AdminShell
      title="Galeria"
      description="Gerencie fotos, categorias e ordem de exibicao do site."
      pathname="/admin/galeria"
      userName={session.user.name}
    >
      <AdminCard title="Nova imagem">
        <form action={saveGalleryImageAction} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            Categoria
            <Input name="category" placeholder="Hotel, Apartamentos..." />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Ordem
            <Input name="order" type="number" defaultValue="0" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Alt text
            <Input name="altText" placeholder="Descricao SEO da imagem" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <input type="checkbox" name="isActive" defaultChecked />
            Imagem ativa
          </label>
          <div className="md:col-span-2">
            <UploadField name="imageUrl" label="Imagem" />
          </div>
          <div className="md:col-span-2">
            <SubmitButton>Adicionar imagem</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid gap-6">
        {images.map((image) => (
          <AdminCard key={image.id} title={image.altText} description={`Categoria: ${image.category}`}>
            <form action={saveGalleryImageAction} className="grid gap-4">
              <input type="hidden" name="id" value={image.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Categoria
                  <Input name="category" defaultValue={image.category} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Ordem
                  <Input name="order" type="number" defaultValue={image.order} />
                </label>
              </div>
              <label className="grid gap-2 text-sm text-slate-600">
                Alt text
                <Input name="altText" defaultValue={image.altText} />
              </label>
              <UploadField name="imageUrl" label="Imagem" defaultValue={image.imageUrl} />
              <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <input type="checkbox" name="isActive" defaultChecked={image.isActive} />
                Imagem ativa
              </label>
              <div className="flex flex-wrap gap-3">
                <SubmitButton>Salvar imagem</SubmitButton>
              </div>
            </form>
            <form action={deleteGalleryImageAction} className="mt-4">
              <input type="hidden" name="id" value={image.id} />
              <button type="submit" className="text-sm font-semibold text-red-500">
                Excluir imagem
              </button>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
