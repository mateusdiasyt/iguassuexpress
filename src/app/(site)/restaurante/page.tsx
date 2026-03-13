import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPageContent, getRestaurantContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("restaurant");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/restaurante",
    image: page.bannerImage,
  });
}

export default async function RestaurantPage() {
  const [page, restaurant] = await Promise.all([
    getPageContent("restaurant"),
    getRestaurantContent(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="Cafe da manha"
            title={restaurant.breakfastTitle}
            description={restaurant.breakfastDescription}
          />
        </article>
        <article className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="A la carte"
            title={restaurant.aLaCarteTitle}
            description={restaurant.aLaCarteDescription}
          />
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {restaurant.images.map((image) => (
          <div key={image} className="relative h-72 overflow-hidden rounded-[1.7rem]">
            <Image src={image} alt="Restaurante do hotel" fill className="object-cover" />
          </div>
        ))}
      </section>
    </div>
  );
}
