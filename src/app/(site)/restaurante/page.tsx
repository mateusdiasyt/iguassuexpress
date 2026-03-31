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
        <article className="soft-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top,rgba(9,77,122,0.08),transparent_58%),radial-gradient(circle_at_bottom,rgba(184,157,116,0.09),transparent_48%)] lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(310px,0.92fr)] lg:items-center">
            <div>
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
                <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-white/75 px-4 py-2 text-sm text-slate-600">
                  <ScrollText className="h-4 w-4 text-brand" />
                  {menuCategories.length} categorias e {totalMenuItems} itens
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200/80 bg-white/72 px-4 py-2">
                  Navegação em tela cheia
                </span>
                <span className="rounded-full border border-slate-200/80 bg-white/72 px-4 py-2">
                  Leitura visual do cardápio
                </span>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(247,250,252,0.72)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(180px,0.85fr)]">
                <div className="relative min-h-[260px] overflow-hidden rounded-[1.45rem]">
                  <Image
                    src={restaurant.images[0] ?? restaurant.heroImage ?? page.bannerImage ?? "/logo-hotel-principal.png"}
                    alt="Destaque do restaurante"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/70">
                      Destaque visual
                    </p>
                    <p className="mt-2 max-w-[14rem] text-xl font-semibold leading-tight text-white">
                      O menu abre com categorias, imagens e leitura mais imersiva.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {restaurant.images.slice(1, 3).map((image, index) => (
                    <div key={`${image}-${index}`} className="relative min-h-[122px] overflow-hidden rounded-[1.3rem]">
                      <Image
                        src={image}
                        alt="Prévia do restaurante"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent" />
                    </div>
                  ))}

                  <div className="rounded-[1.3rem] border border-brand/10 bg-white/82 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                      Leitura rápida
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] bg-slate-50 px-3 py-3">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Categorias
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{menuCategories.length}</p>
                      </div>
                      <div className="rounded-[1rem] bg-slate-50 px-3 py-3">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Itens
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{totalMenuItems}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
