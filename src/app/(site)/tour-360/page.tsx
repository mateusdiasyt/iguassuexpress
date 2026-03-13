import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPageContent, getTour360Content } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("tour-360");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/tour-360",
    image: page.bannerImage,
  });
}

export default async function Tour360Page() {
  const [page, tour] = await Promise.all([getPageContent("tour-360"), getTour360Content()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <section className="soft-card rounded-[1.8rem] p-8">
        <SectionHeading eyebrow="Tour 360" title={tour.title} description={tour.description} />
        <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-brand/10 bg-slate-950/3">
          {tour.embedUrl ? (
            <iframe
              src={tour.embedUrl}
              title={tour.title}
              className="h-[560px] w-full"
              allowFullScreen
            />
          ) : (
            <div className="grid min-h-[360px] place-items-center px-6 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
                  Em breve
                </p>
                <h2 className="mt-4 text-4xl leading-none text-slate-950">
                  O tour virtual sera publicado aqui
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Enquanto o material oficial nao estiver disponivel, esta area continua preparada para receber o embed sem ajustes estruturais.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
