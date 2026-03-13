import { saveTour360Action } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
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
      description="Atualize titulo, descricao, embed e banner do tour virtual."
      pathname="/admin/tour-360"
      userName={session.user.name}
    >
      <AdminCard title="Conteudo do tour 360">
        <form action={saveTour360Action} className="grid gap-5">
          <label className="grid gap-2 text-sm text-slate-600">
            Titulo
            <Input name="title" defaultValue={tour.title} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao
            <Textarea name="description" defaultValue={tour.description} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Embed URL
            <Input name="embedUrl" defaultValue={tour.embedUrl ?? ""} />
          </label>
          <UploadField name="heroImage" label="Imagem principal" defaultValue={tour.heroImage} />
          <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <input type="checkbox" name="isActive" defaultChecked={tour.isActive} />
            Tour ativo
          </label>
          <div>
            <SubmitButton>Salvar tour 360</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
