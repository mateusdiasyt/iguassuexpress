import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getGalleryImages, getPageContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("gallery");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/galeria-de-fotos",
    image: page.bannerImage,
  });
}

export default async function GalleryPage() {
  const [page, images] = await Promise.all([getPageContent("gallery"), getGalleryImages()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[2rem] px-6 py-6 md:px-8">
        <RichText content={getContentBody(page.content)} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
              Galeria publica
            </p>
            <h2 className="mt-2 text-[2rem] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-950 md:text-[2.5rem]">
              Imagens do hotel
            </h2>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            {images.length} {images.length === 1 ? "foto" : "fotos"}
          </span>
        </div>

        {images.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <figure
                key={image.id}
                className="group overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/92 shadow-[0_20px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-slate-950/0 to-slate-950/10" />

                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white/92 px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                      Galeria
                    </span>
                    <span className="rounded-full bg-slate-950/46 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-sm">
                      Foto {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <figcaption className="px-5 py-4">
                  <p className="text-[1.02rem] font-medium tracking-[-0.02em] text-slate-700">
                    {image.altText}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <section className="soft-card rounded-[2rem] px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-slate-950">Nenhuma foto publicada</h2>
          </section>
        )}
      </section>
    </div>
  );
}
