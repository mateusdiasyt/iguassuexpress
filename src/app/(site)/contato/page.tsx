import type { ReactNode } from "react";
import { Mail, MessageCircle, PhoneCall, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getPageContent, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { formatPhoneHref, formatWhatsAppHref, getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("contact");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/contato",
    image: page.bannerImage,
  });
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand/70">
      {children}
    </p>
  );
}

function ContactChannelCard({
  eyebrow,
  title,
  value,
  href,
  icon: Icon,
  highlight = false,
}: {
  eyebrow: string;
  title: string;
  value: string;
  href: string;
  icon: typeof Mail;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={
        highlight
          ? "rounded-[1.7rem] border border-emerald-200/70 bg-emerald-50/80 p-6 shadow-[0_16px_30px_rgba(16,185,129,0.15)] transition-transform duration-300 hover:-translate-y-0.5 md:p-7"
          : "soft-card rounded-[1.7rem] p-6 transition-transform duration-300 hover:-translate-y-0.5 md:p-7"
      }
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={
              highlight
                ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
                : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand"
            }
          >
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {eyebrow}
            </span>
            <h3 className="mt-4 text-[1.8rem] leading-[0.96] font-semibold text-slate-950">{title}</h3>
            <p className="mt-3 break-words text-sm leading-7 text-slate-600">{value}</p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700">
          Abrir canal
        </span>
      </div>
    </a>
  );
}

function SupportNote({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="soft-card rounded-[1.55rem] p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
        <Sparkles className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPageContent("contact"), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} badge="Contato" />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
        <article className="soft-card rounded-[2rem] p-6 md:p-8 lg:p-10">
          <SectionEyebrow>Atendimento</SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-[2.2rem] leading-[0.94] font-semibold text-slate-950 md:text-[3.2rem]">
            Fale com nossa equipe pelo canal que for mais conveniente.
          </h2>

          <div className="mt-6 max-w-3xl">
            <RichText content={getContentBody(page.content)} />
          </div>
        </article>

        <div className="grid gap-4">
          <SupportNote
            title="Contato direto e rapido"
            description="Use WhatsApp, telefone ou e-mail para tirar duvidas, pedir suporte e alinhar detalhes da sua estada."
          />
          <SupportNote
            title="Tudo em um so lugar"
            description="A pagina agora concentra apenas os canais oficiais de contato, sem mapa e sem etapas extras."
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(240px,0.6fr)] lg:items-end">
          <div>
            <SectionEyebrow>Canais diretos</SectionEyebrow>
            <h2 className="mt-3 text-[2.15rem] leading-[0.94] font-semibold text-slate-950 md:text-[3rem]">
              WhatsApp, telefone e e-mail em largura total.
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            Escolha o formato que funciona melhor para voce e fale com o hotel sem precisar passar por outras colunas.
          </p>
        </div>

        <div className="grid gap-4">
          <ContactChannelCard
            eyebrow="WhatsApp"
            title="Atendimento oficial"
            value={settings.whatsapp}
            href={formatWhatsAppHref(settings.whatsapp, "Ola! Gostaria de falar com a equipe do hotel.")}
            icon={MessageCircle}
            highlight
          />
          <ContactChannelCard
            eyebrow="Telefone"
            title="Ligacao direta"
            value={settings.phone}
            href={formatPhoneHref(settings.phone)}
            icon={PhoneCall}
          />
          <ContactChannelCard
            eyebrow="E-mail"
            title="Mensagem por escrito"
            value={settings.email}
            href={`mailto:${settings.email}`}
            icon={Mail}
          />
        </div>
      </section>
    </div>
  );
}
