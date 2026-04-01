import type { ReactNode } from "react";
import Link from "next/link";
import {
  CarFront,
  Compass,
  MapPinned,
  MessageCircle,
  PhoneCall,
  Route,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getLocationContent, getPageContent, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { formatPhoneHref, formatWhatsAppHref, getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("location");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/localizacao",
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

function UtilityCard({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof MapPinned;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <article className="soft-card rounded-[1.55rem] p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <SectionEyebrow>
        <span className="mt-4 block">{eyebrow}</span>
      </SectionEyebrow>
      <h3 className="mt-3 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function NearbyPointCard({
  point,
  index,
}: {
  point: string;
  index: number;
}) {
  return (
    <article className="soft-card rounded-[1.6rem] p-5 md:p-6">
      <span className="rounded-full border border-brand/10 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/70">
        Ponto {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-4 text-[1.55rem] leading-[0.98] font-semibold text-slate-950">{point}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Deslocamento facilitado a partir do hotel, com acesso pratico para turismo e compromissos na cidade.
      </p>
    </article>
  );
}

function ActionCard({
  whatsapp,
  phone,
  address,
}: {
  whatsapp: string;
  phone: string;
  address: string;
}) {
  const mapsQuery = encodeURIComponent(address || "Iguassu Express Hotel Foz do Iguaçu");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <article className="soft-card rounded-[1.9rem] p-6 md:p-7">
      <SectionEyebrow>Como chegar</SectionEyebrow>
      <h3 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
        Escolha o melhor caminho até o hotel.
      </h3>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
        Use o mapa para visualizar a região e fale com nossa equipe se quiser ajuda com rota, táxi ou acesso por aplicativo.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(9,77,122,0.22)] transition hover:bg-brand-deep"
        >
          <Route className="h-4 w-4" />
          Abrir no Google Maps
        </Link>

        <Link
          href={formatWhatsAppHref(whatsapp, "Olá! Gostaria de ajuda para chegar ao hotel.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <MessageCircle className="h-4 w-4" />
          Pedir orientação no WhatsApp
        </Link>

        <Link
          href={formatPhoneHref(phone)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <PhoneCall className="h-4 w-4" />
          Ligar para o hotel
        </Link>
      </div>
    </article>
  );
}

function LocationMap({
  mapEmbed,
}: {
  mapEmbed?: string | null;
}) {
  return mapEmbed ? (
    <div
      className="map-embed soft-card h-[340px] overflow-hidden rounded-[1.9rem] md:h-[420px] xl:h-[520px] [&>iframe]:block [&>iframe]:h-full [&>iframe]:w-full [&>div]:h-full [&>div]:w-full [&_iframe]:block [&_iframe]:h-full [&_iframe]:w-full"
      dangerouslySetInnerHTML={{ __html: mapEmbed }}
    />
  ) : (
    <article className="soft-card flex h-[340px] items-center justify-center rounded-[1.9rem] p-8 text-center md:h-[420px] xl:h-[520px]">
      <div>
        <SectionEyebrow>Mapa</SectionEyebrow>
        <h3 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
          Mapa indisponível no momento
        </h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
          Nossa equipe pode orientar sua chegada por WhatsApp ou telefone enquanto o mapa não estiver disponível.
        </p>
      </div>
    </article>
  );
}

export default async function LocationPage() {
  const [page, location, settings] = await Promise.all([
    getPageContent("location"),
    getLocationContent(),
    getSiteSettings(),
  ]);

  const mapEmbed = location.mapEmbed ?? settings.mapEmbed ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} badge="Localização" />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
        <article className="soft-card rounded-[2rem] p-6 md:p-8 lg:p-10">
          <SectionEyebrow>Endereço estratégico</SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-[2.2rem] leading-[0.94] font-semibold text-slate-950 md:text-[3.2rem]">
            Estar bem localizado muda a experiência inteira da viagem.
          </h2>

          <div className="mt-6 max-w-3xl">
            <RichText content={getContentBody(page.content)} />
          </div>

          {location.accessDetails ? (
            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 md:text-base md:leading-8">
              {location.accessDetails}
            </p>
          ) : null}
        </article>

        <div className="grid gap-4">
          <UtilityCard
            icon={Compass}
            eyebrow="Base"
            title={location.title}
            description={location.description}
          />
          <UtilityCard
            icon={CarFront}
            eyebrow="Acesso"
            title="Chegada mais simples"
            description="Saídas práticas para aeroporto, atrativos e corredores importantes da cidade, com deslocamento facilitado."
          />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] xl:items-start">
        <div className="space-y-6">
          <div className="max-w-4xl space-y-4">
            <SectionEyebrow>Mapa e acesso</SectionEyebrow>
            <h2 className="max-w-3xl text-[2.15rem] leading-[0.94] font-semibold text-slate-950 md:text-[3rem]">
              Veja a região e organize o trajeto com antecedência.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base md:leading-8">
              A localização do hotel favorece deslocamentos para turismo, compras e compromissos corporativos em Foz do Iguaçu.
            </p>
          </div>

          <LocationMap mapEmbed={mapEmbed} />
        </div>

        <div className="space-y-6 xl:sticky xl:top-28">
          <ActionCard whatsapp={settings.whatsapp} phone={settings.phone} address={settings.address} />
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(240px,0.6fr)] lg:items-end">
          <div>
            <SectionEyebrow>Pontos próximos</SectionEyebrow>
            <h2 className="mt-3 text-[2.15rem] leading-[0.94] font-semibold text-slate-950 md:text-[3rem]">
              Referências importantes ao redor do hotel.
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            Estes pontos ajudam a entender a conveniência da região e a facilidade de circulação durante a estada.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {location.nearbyPoints.map((point, index) => (
            <NearbyPointCard key={point} point={point} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
