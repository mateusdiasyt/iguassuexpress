import { saveLocationAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getLocationContent } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Localizacao Admin",
  description: "Edicao do mapa, textos e pontos proximos.",
  path: "/admin/localizacao",
  noIndex: true,
});

export default async function AdminLocationPage() {
  const session = await requireAdmin();
  const location = await getLocationContent();

  return (
    <AdminShell
      title="Localizacao"
      description="Atualize mapa, texto institucional, acessos e pontos proximos."
      pathname="/admin/localizacao"
      userName={session.user.name}
    >
      <AdminCard title="Conteudo da localizacao">
        <form action={saveLocationAction} className="grid gap-5">
          <label className="grid gap-2 text-sm text-slate-600">
            Titulo
            <Input name="title" defaultValue={location.title} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao
            <Textarea name="description" defaultValue={location.description} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Mapa embed
            <Textarea name="mapEmbed" defaultValue={location.mapEmbed ?? ""} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Pontos proximos
            <Textarea name="nearbyPoints" defaultValue={location.nearbyPoints.join("\n")} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Detalhes de acesso
            <Textarea name="accessDetails" defaultValue={location.accessDetails ?? ""} />
          </label>
          <UploadField name="heroImage" label="Imagem principal" defaultValue={location.heroImage} />
          <div>
            <SubmitButton>Salvar localizacao</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
