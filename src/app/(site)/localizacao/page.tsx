import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLocationContent, getPageContent, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("location");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/localizacao",
    image: page.bannerImage,
  });
}

export default async function LocationPage() {
  const [page, location, settings] = await Promise.all([
    getPageContent("location"),
    getLocationContent(),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6 rounded-[1.8rem] border border-brand/10 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Estrategia"
            title={location.title}
            description={location.description}
          />
          <div className="grid gap-3">
            {location.nearbyPoints.map((point) => (
              <div key={point} className="rounded-2xl bg-slate-950/4 px-4 py-3 text-sm text-slate-700">
                {point}
              </div>
            ))}
          </div>
          {location.accessDetails ? (
            <p className="text-sm leading-8 text-slate-600">{location.accessDetails}</p>
          ) : null}
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
          >
            Falar com a equipe
          </a>
        </div>
        <div
          className="map-embed soft-card min-h-[420px] overflow-hidden rounded-[1.8rem]"
          dangerouslySetInnerHTML={{ __html: location.mapEmbed ?? settings.mapEmbed ?? "" }}
        />
      </section>
    </div>
  );
}
