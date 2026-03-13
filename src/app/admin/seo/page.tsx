import { savePageContentAction, saveSiteSettingsAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getPageContents, getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { stringifyJson } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "SEO Admin",
  description: "Gestao de SEO global e por pagina.",
  path: "/admin/seo",
  noIndex: true,
});

export default async function AdminSeoPage() {
  const session = await requireAdmin();
  const [settings, pages] = await Promise.all([getSiteSettings(), getPageContents()]);
  const socialLinks = (settings.socialLinks as { instagram?: string; facebook?: string } | null) ?? {};

  return (
    <AdminShell
      title="SEO"
      description="Ajuste titulos, descricoes e indexacao das paginas principais."
      pathname="/admin/seo"
      userName={session.user.name}
    >
      <AdminCard title="SEO global">
        <form action={saveSiteSettingsAction} className="grid gap-4">
          <input type="hidden" name="hotelName" value={settings.hotelName} />
          <input type="hidden" name="whatsapp" value={settings.whatsapp} />
          <input type="hidden" name="phone" value={settings.phone} />
          <input type="hidden" name="email" value={settings.email} />
          <input type="hidden" name="address" value={settings.address} />
          <input type="hidden" name="mapEmbed" value={settings.mapEmbed ?? ""} />
          <input type="hidden" name="omnibeesHotelId" value={settings.omnibeesHotelId} />
          <input type="hidden" name="omnibeesBaseUrl" value={settings.omnibeesBaseUrl} />
          <input type="hidden" name="logo" value={settings.logo ?? ""} />
          <input type="hidden" name="favicon" value={settings.favicon ?? ""} />
          <input type="hidden" name="instagram" value={socialLinks.instagram ?? ""} />
          <input type="hidden" name="facebook" value={socialLinks.facebook ?? ""} />
          <input type="hidden" name="institutionalBio" value={settings.institutionalBio ?? ""} />
          <label className="grid gap-2 text-sm text-slate-600">
            SEO title do site
            <Input name="seoTitle" defaultValue={settings.seoTitle ?? ""} />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            SEO description do site
            <Textarea name="seoDescription" defaultValue={settings.seoDescription ?? ""} />
          </label>
          <div>
            <SubmitButton>Salvar SEO global</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid gap-6">
        {pages.map((page) => (
          <AdminCard key={page.key} title={page.title} description={`SEO da pagina ${page.key}`}>
            <form action={savePageContentAction} className="grid gap-4">
              <input type="hidden" name="key" value={page.key} />
              <input type="hidden" name="title" value={page.title} />
              <input type="hidden" name="subtitle" value={page.subtitle ?? ""} />
              <input type="hidden" name="bannerImage" value={page.bannerImage ?? ""} />
              <input type="hidden" name="content" value={stringifyJson(page.content)} />
              <label className="grid gap-2 text-sm text-slate-600">
                SEO title
                <Input name="seoTitle" defaultValue={page.seoTitle ?? ""} />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                SEO description
                <Textarea name="seoDescription" defaultValue={page.seoDescription ?? ""} />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <input type="checkbox" name="isPublished" defaultChecked={page.isPublished} />
                Indexar pagina
              </label>
              <div>
                <SubmitButton>Salvar SEO da pagina</SubmitButton>
              </div>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
