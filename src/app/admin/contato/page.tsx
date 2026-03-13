import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { savePageContentAction, saveSiteSettingsAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getContactMessages, getPageContent, getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { stringifyJson } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Contato Admin",
  description: "Gestao dos canais de contato e mensagens recebidas.",
  path: "/admin/contato",
  noIndex: true,
});

export default async function AdminContactPage() {
  const session = await requireAdmin();
  const [settings, page, messages] = await Promise.all([
    getSiteSettings(),
    getPageContent("contact"),
    getContactMessages(),
  ]);
  const socialLinks = (settings.socialLinks as { instagram?: string; facebook?: string } | null) ?? {};

  return (
    <AdminShell
      title="Contato"
      description="Edite canais oficiais e acompanhe as mensagens enviadas pelo formulario."
      pathname="/admin/contato"
      userName={session.user.name}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminCard title="Dados de contato">
          <form action={saveSiteSettingsAction} className="grid gap-4">
            <input type="hidden" name="hotelName" value={settings.hotelName} />
            <input type="hidden" name="omnibeesHotelId" value={settings.omnibeesHotelId} />
            <input type="hidden" name="omnibeesBaseUrl" value={settings.omnibeesBaseUrl} />
            <input type="hidden" name="logo" value={settings.logo ?? ""} />
            <input type="hidden" name="favicon" value={settings.favicon ?? ""} />
            <input type="hidden" name="instagram" value={socialLinks.instagram ?? ""} />
            <input type="hidden" name="facebook" value={socialLinks.facebook ?? ""} />
            <input type="hidden" name="seoTitle" value={settings.seoTitle ?? ""} />
            <input type="hidden" name="seoDescription" value={settings.seoDescription ?? ""} />
            <input type="hidden" name="institutionalBio" value={settings.institutionalBio ?? ""} />

            <label className="grid gap-2 text-sm text-slate-600">
              WhatsApp
              <Input name="whatsapp" defaultValue={settings.whatsapp} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Telefone
              <Input name="phone" defaultValue={settings.phone} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              E-mail
              <Input name="email" type="email" defaultValue={settings.email} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Endereco
              <Input name="address" defaultValue={settings.address} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Mapa embed
              <Textarea name="mapEmbed" defaultValue={settings.mapEmbed ?? ""} />
            </label>
            <div>
              <SubmitButton>Salvar contatos</SubmitButton>
            </div>
          </form>
        </AdminCard>

        <AdminCard title="Texto da pagina de contato">
          <form action={savePageContentAction} className="grid gap-4">
            <input type="hidden" name="key" value={page.key} />
            <input type="hidden" name="bannerImage" value={page.bannerImage ?? ""} />
            <input type="hidden" name="seoTitle" value={page.seoTitle ?? ""} />
            <input type="hidden" name="seoDescription" value={page.seoDescription ?? ""} />
            <input type="hidden" name="isPublished" value={page.isPublished ? "true" : "false"} />
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo
              <Input name="title" defaultValue={page.title} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Subtitulo
              <Input name="subtitle" defaultValue={page.subtitle ?? ""} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Conteudo
              <Textarea name="content" className="min-h-48" defaultValue={stringifyJson(page.content)} />
            </label>
            <div>
              <SubmitButton>Salvar texto</SubmitButton>
            </div>
          </form>
        </AdminCard>
      </div>

      <AdminCard title="Mensagens recebidas">
        <div className="grid gap-4">
          {messages.map((message) => (
            <article key={message.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-slate-900">{message.name}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {format(message.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{message.email}</p>
              <p className="mt-1 text-sm text-slate-600">{message.phone ?? "Sem telefone"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{message.message}</p>
            </article>
          ))}
          {!messages.length ? (
            <p className="text-sm text-slate-500">Nenhuma mensagem recebida ainda.</p>
          ) : null}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
