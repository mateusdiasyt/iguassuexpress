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
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <section className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
        {images.map((image) => (
          <figure key={image.id} className="break-inside-avoid overflow-hidden rounded-[1.7rem] bg-white shadow-sm">
            <div className="relative min-h-72">
              <Image src={image.imageUrl} alt={image.altText} fill className="object-cover" />
            </div>
            <figcaption className="px-5 py-4 text-sm text-slate-600">
              {image.altText}
            </figcaption>
          </figure>
        ))}
      </section>
    </div>
  );
}
