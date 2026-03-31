import Image from "next/image";
import { ScrollText } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RestaurantMenuDialog } from "@/components/site/restaurant-menu-dialog";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMenuCategories, getPageContent, getRestaurantContent } from "@/data/queries";
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
  const [page, restaurant, menuCategories] = await Promise.all([
    getPageContent("restaurant"),
    getRestaurantContent(),
    getMenuCategories(),
  ]);

  const totalMenuItems = menuCategories.reduce(
    (total, category) =>
      total + category.items.length + category.children.reduce((childTotal, child) => childTotal + child.items.length, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>

      <section>
        <article className="soft-card rounded-[2rem] p-8">
          <SectionHeading
            eyebrow="Cardápio interativo"
            title="Abra o menu completo e explore a experiência do restaurante."
            description="Um pop-up imersivo apresenta categorias, destaques e valores em uma leitura mais sofisticada do cardápio."
            layout="stacked"
            className="[&_h2]:max-w-[26rem] [&_h2]:text-[2.3rem] [&_h2]:leading-[0.95] md:[&_h2]:text-[3rem]"
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <RestaurantMenuDialog
              categories={menuCategories}
              heroImage={restaurant.heroImage}
              galleryImages={restaurant.images}
              breakfastTitle={restaurant.breakfastTitle}
              aLaCarteTitle={restaurant.aLaCarteTitle}
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-white/70 px-4 py-2 text-sm text-slate-600">
              <ScrollText className="h-4 w-4 text-brand" />
              {menuCategories.length} categorias e {totalMenuItems} itens
            </span>
          </div>
        </article>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="Café da manhã"
            title={restaurant.breakfastTitle}
            description={restaurant.breakfastDescription}
            layout="stacked"
          />
        </article>
        <article className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="A la carte"
            title={restaurant.aLaCarteTitle}
            description={restaurant.aLaCarteDescription}
            layout="stacked"
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
