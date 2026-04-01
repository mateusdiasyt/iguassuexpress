import Image from "next/image";
import { Coffee, ScrollText, UtensilsCrossed } from "lucide-react";
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
      total +
      category.items.length +
      category.children.reduce((childTotal, child) => childTotal + child.items.length, 0),
    0,
  );

  const restaurantImage =
    restaurant.images[0] ?? restaurant.heroImage ?? page.bannerImage ?? "/logo-hotel-principal.png";

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>

      <section>
        <article className="soft-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top,rgba(9,77,122,0.08),transparent_58%),radial-gradient(circle_at_bottom,rgba(184,157,116,0.09),transparent_48%)] lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,1fr)] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Cardapio interativo"
                title="Abra o menu completo e explore a experiencia do restaurante."
                description="Um pop-up imersivo apresenta categorias, destaques e valores em uma leitura mais sofisticada do cardapio."
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
                  Navegacao em tela cheia
                </span>
                <span className="rounded-full border border-slate-200/80 bg-white/72 px-4 py-2">
                  Leitura visual do cardapio
                </span>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(247,250,252,0.72)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-4">
                <div className="relative min-h-[360px] overflow-hidden rounded-[1.55rem]">
                  <Image
                    src={restaurantImage}
                    alt="Destaque do restaurante"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-950/12 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/70">
                      Destaque visual
                    </p>
                    <p className="mt-2 max-w-[18rem] text-xl font-semibold leading-tight text-white">
                      Cardapio Smart Express com uma leitura mais elegante e imersiva.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
                  <article className="rounded-[1.45rem] border border-brand/10 bg-white/84 p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                        <Coffee className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                          Cafe da manha
                        </p>
                        <h3 className="mt-2 text-[1.35rem] leading-tight font-semibold tracking-[-0.03em] text-slate-950">
                          {restaurant.breakfastTitle}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {restaurant.breakfastDescription}
                    </p>
                  </article>

                  <article className="rounded-[1.45rem] border border-brand/10 bg-white/84 p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                        <UtensilsCrossed className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                          A la carte
                        </p>
                        <h3 className="mt-2 text-[1.35rem] leading-tight font-semibold tracking-[-0.03em] text-slate-950">
                          {restaurant.aLaCarteTitle}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {restaurant.aLaCarteDescription}
                    </p>
                  </article>

                  <div className="rounded-[1.45rem] border border-brand/10 bg-white/82 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                      Leitura rapida
                    </p>
                    <div className="mt-3 grid gap-3">
                      <div className="rounded-[1rem] bg-slate-50 px-3 py-3">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Categorias
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {menuCategories.length}
                        </p>
                      </div>
                      <div className="rounded-[1rem] bg-slate-50 px-3 py-3">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Itens
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {totalMenuItems}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
