import { saveSiteSettingsAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildGoogleMapsEmbedUrl, buildHotelMapQuery } from "@/lib/maps";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Configuracoes Admin",
  description: "Configuracoes gerais do hotel, canais e integracoes.",
  path: "/admin/configuracoes",
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const settings = await getSiteSettings();
  const mapQuery = buildHotelMapQuery({
    hotelName: settings.hotelName,
    address: settings.address,
  });
  const mapEmbedUrl = buildGoogleMapsEmbedUrl(mapQuery);

  return (
    <AdminShell
      title="Configuracoes"
      description="Dados gerais do hotel, integracoes e identidade institucional."
      pathname="/admin/configuracoes"
      userName={session.user.name}
    >
      <AdminCard title="Dados gerais" description="Atualize canais oficiais, Omnibees, logo e informacoes institucionais.">
        <form action={saveSiteSettingsAction} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Nome do hotel
              <Input name="hotelName" defaultValue={settings.hotelName} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              E-mail
              <Input name="email" type="email" defaultValue={settings.email} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              WhatsApp
              <Input name="whatsapp" defaultValue={settings.whatsapp} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Telefone
              <Input name="phone" defaultValue={settings.phone} />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:items-end">
            <label className="grid gap-2 text-sm text-slate-600">
              Endereco
              <Input name="address" defaultValue={settings.address} />
              <span className="text-xs leading-5 text-slate-400">
                Este endereco alimenta automaticamente os mapas da home e da pagina de localizacao.
              </span>
            </label>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <iframe
                src={mapEmbedUrl}
                title={`Preview do mapa de ${settings.hotelName}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-48 w-full border-0"
                allowFullScreen
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Omnibees base URL
              <Input name="omnibeesBaseUrl" defaultValue={settings.omnibeesBaseUrl} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Omnibees hotel ID
              <Input name="omnibeesHotelId" defaultValue={settings.omnibeesHotelId} />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <UploadField name="logo" label="Logo" defaultValue={settings.logo} />
            <UploadField name="favicon" label="Favicon" defaultValue={settings.favicon} />
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-slate-600">
              SEO title principal
              <Input name="seoTitle" defaultValue={settings.seoTitle ?? ""} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              SEO description principal
              <Textarea name="seoDescription" defaultValue={settings.seoDescription ?? ""} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Texto institucional
              <Textarea name="institutionalBio" defaultValue={settings.institutionalBio ?? ""} />
            </label>
          </div>

          <div>
            <SubmitButton>Salvar configuracoes</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
