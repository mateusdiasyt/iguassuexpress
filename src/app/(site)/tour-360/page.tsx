import Image from "next/image";
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
  const tourGallery = Array.from(
    new Set(
      [(tour.gallery ?? [])[0] || tour.heroImage, ...(tour.gallery ?? [])].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  );

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
      {tourGallery.length ? (
        <section className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="Galeria 360"
            title="Cenas publicadas para a experiencia imersiva"
            description="As imagens adicionadas no painel abastecem a vitrine panoramica da Home e esta galeria dedicada do tour."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tourGallery.map((image, index) => (
              <article
                key={`${image}-${index}`}
                className="overflow-hidden rounded-[1.6rem] border border-brand/10 bg-white shadow-[0_18px_34px_rgba(15,23,42,0.06)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={image}
                    alt={`Cena 360 ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                    Cena {index + 1}
                  </p>
                  <h3 className="text-2xl leading-none text-slate-950">
                    {index === 0 ? "Vista principal do tour" : `Ambiente panoramico ${index + 1}`}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    Material pronto para compor uma navegacao 360 mais rica, com novas cenas adicionadas pelo painel sempre que precisar.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
