import { saveLocationAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getLocationContent, getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildGoogleMapsEmbedUrl, buildHotelMapQuery } from "@/lib/maps";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Localizacao Admin",
  description: "Edicao do mapa, textos e pontos proximos.",
  path: "/admin/localizacao",
  noIndex: true,
});

export default async function AdminLocationPage() {
  const session = await requireAdmin();
  const [location, settings] = await Promise.all([getLocationContent(), getSiteSettings()]);
  const mapQuery = buildHotelMapQuery({
    hotelName: settings.hotelName,
    address: settings.address,
  });
  const mapEmbedUrl = buildGoogleMapsEmbedUrl(mapQuery);

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
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <iframe
              src={mapEmbedUrl}
              title={`Preview do mapa de ${settings.hotelName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0"
              allowFullScreen
            />
            <div className="border-t border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-500">
              O mapa usa o endereco salvo em Configuracoes: {settings.address}.
            </div>
          </div>
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
