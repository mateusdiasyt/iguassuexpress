import type { ReactNode } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  PlusSquare,
  ScanSearch,
} from "lucide-react";
import { savePageContentAction, saveSiteSettingsAction } from "@/actions/admin";
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

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
type PageContent = Awaited<ReturnType<typeof getPageContent>>;
type ContactMessages = Awaited<ReturnType<typeof getContactMessages>>;
type ContactMessage = ContactMessages[number];

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
      <input type="hidden" name="seoTitle" value={settings.seoTitle ?? ""} />
      <input type="hidden" name="seoDescription" value={settings.seoDescription ?? ""} />
      <input type="hidden" name="institutionalBio" value={settings.institutionalBio ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
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

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Endereco</FieldLabel>
          <Input name="address" defaultValue={settings.address} />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-slate-600">
        <FieldLabel>Mapa embed</FieldLabel>
        <Textarea
          name="mapEmbed"
          defaultValue={settings.mapEmbed ?? ""}
          className="min-h-[170px] rounded-[1.6rem]"
        />
      </label>

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

function MessageCard({ message }: { message: ContactMessage }) {
  const hasPhone = Boolean(message.phone?.trim());

  return (
    <article className="rounded-[1.55rem] border border-slate-200/80 bg-slate-50/75 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-950">{message.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {format(message.createdAt, "dd/MM/yyyy - HH:mm", { locale: ptBR })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${message.email}`}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            <Mail className="h-3.5 w-3.5" />
            {message.email}
          </a>

          {hasPhone ? (
            <a
              href={`https://wa.me/${String(message.phone).replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <Phone className="h-3.5 w-3.5" />
              {message.phone}
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{message.message}</p>
    </article>
  );
}

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
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Contato</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Canais e mensagens
            </h1>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            {messages.length} {messages.length === 1 ? "mensagem" : "mensagens"}
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]">
          <div className="space-y-6">
            <EditorShell
              eyebrow="Canais"
              title="Dados de contato"
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
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <div>
                  <SectionEyebrow>Resumo</SectionEyebrow>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    Contato publico
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
                    Endereco
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{settings.address}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.9rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <MessageSquareText className="h-4.5 w-4.5" />
                </span>
                <div>
                  <SectionEyebrow>Inbox</SectionEyebrow>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    Mensagens recebidas
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {messages.length ? (
                  messages.map((message) => <MessageCard key={message.id} message={message} />)
                ) : (
                  <article className="rounded-[1.45rem] border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
                    <ScanSearch className="mx-auto h-5 w-5 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500">Nenhuma mensagem recebida ainda.</p>
                  </article>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </AdminShell>
  );
}
