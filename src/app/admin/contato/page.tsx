import type { ReactNode } from "react";
import {
  Mail,
  Phone,
  PlusSquare,
} from "lucide-react";
import { savePageContentAction, saveSiteSettingsAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getPageContent, getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { stringifyJson } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Contato Admin",
  description: "Gestao dos canais de contato e mensagens recebidas.",
  path: "/admin/contato",
  noIndex: true,
});

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
type PageContent = Awaited<ReturnType<typeof getPageContent>>;

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function EditorShell({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </span>
        <div>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h2>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="font-medium text-slate-950">{children}</span>;
}

function ContactChannelsForm({
  settings,
  instagram,
  facebook,
}: {
  settings: SiteSettings;
  instagram: string;
  facebook: string;
}) {
  return (
    <form action={saveSiteSettingsAction} className="grid gap-4">
      <input type="hidden" name="hotelName" value={settings.hotelName} />
      <input type="hidden" name="omnibeesHotelId" value={settings.omnibeesHotelId} />
      <input type="hidden" name="omnibeesBaseUrl" value={settings.omnibeesBaseUrl} />
      <input type="hidden" name="logo" value={settings.logo ?? ""} />
      <input type="hidden" name="favicon" value={settings.favicon ?? ""} />
      <input type="hidden" name="instagram" value={instagram} />
      <input type="hidden" name="facebook" value={facebook} />
      <input type="hidden" name="address" value={settings.address} />
      <input type="hidden" name="mapEmbed" value={settings.mapEmbed ?? ""} />
      <input type="hidden" name="seoTitle" value={settings.seoTitle ?? ""} />
      <input type="hidden" name="seoDescription" value={settings.seoDescription ?? ""} />
      <input type="hidden" name="institutionalBio" value={settings.institutionalBio ?? ""} />

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>WhatsApp</FieldLabel>
          <Input name="whatsapp" defaultValue={settings.whatsapp} />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Telefone</FieldLabel>
          <Input name="phone" defaultValue={settings.phone} />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>E-mail</FieldLabel>
          <Input name="email" type="email" defaultValue={settings.email} />
        </label>
      </div>

      <div className="flex justify-end rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
        <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
          Salvar contatos
        </SubmitButton>
      </div>
    </form>
  );
}

function ContactPageForm({ page }: { page: PageContent }) {
  return (
    <form action={savePageContentAction} className="grid gap-4">
      <input type="hidden" name="key" value={page.key} />
      <input type="hidden" name="bannerImage" value={page.bannerImage ?? ""} />
      <input type="hidden" name="seoTitle" value={page.seoTitle ?? ""} />
      <input type="hidden" name="seoDescription" value={page.seoDescription ?? ""} />
      <input type="hidden" name="isPublished" value={page.isPublished ? "true" : "false"} />

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Titulo</FieldLabel>
          <Input name="title" defaultValue={page.title} />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Subtitulo</FieldLabel>
          <Input name="subtitle" defaultValue={page.subtitle ?? ""} />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Conteudo</FieldLabel>
          <Textarea
            name="content"
            className="min-h-[240px] rounded-[1.6rem]"
            defaultValue={stringifyJson(page.content)}
          />
        </label>
      </div>

      <div className="flex justify-end rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
        <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
          Salvar texto
        </SubmitButton>
      </div>
    </form>
  );
}

export default async function AdminContactPage() {
  const session = await requireAdmin();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("contact"),
  ]);

  const socialLinks = (settings.socialLinks as { instagram?: string; facebook?: string } | null) ?? {};

  return (
    <AdminShell
      title="Contato"
      description="Edite canais oficiais e acompanhe as mensagens enviadas pelo formulario."
      pathname="/admin/contato"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Contato</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Canais e mensagens
            </h1>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            Inbox
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]">
          <div className="space-y-6">
            <EditorShell
              eyebrow="Canais"
              title="Infos de contato"
              icon={<Phone className="h-4.5 w-4.5" />}
            >
              <ContactChannelsForm
                settings={settings}
                instagram={socialLinks.instagram ?? ""}
                facebook={socialLinks.facebook ?? ""}
              />
            </EditorShell>

            <EditorShell
              eyebrow="Pagina"
              title="Texto da pagina de contato"
              icon={<PlusSquare className="h-4.5 w-4.5" />}
            >
              <ContactPageForm page={page} />
            </EditorShell>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.9rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <div>
                  <SectionEyebrow>Resumo</SectionEyebrow>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    Canais publicados
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    WhatsApp
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{settings.whatsapp}</p>
                </div>
                <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    E-mail
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{settings.email}</p>
                </div>
                <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Telefone
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{settings.phone}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </AdminShell>
  );
}
