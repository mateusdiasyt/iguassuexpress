import type { ReactNode } from "react";
import Image from "next/image";
import {
  Coffee,
  Expand,
  LayoutGrid,
  ImagePlay,
  ScrollText,
  Sparkles,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RestaurantMenuDialog } from "@/components/site/restaurant-menu-dialog";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMenuCategories, getPageContent, getRestaurantContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPageContent("restaurant");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/restaurante",
    image: page.bannerImage,
  });
}

function ServiceCard({
  eyebrow,
  title,
  description,
  icon,
  toneClass,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  toneClass: string;
}) {
  return (
    <article
      className={`flex h-full rounded-[1.65rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ${toneClass}`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/70 text-brand shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
          {icon}
        </span>
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[1.4rem] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h2>
          <p className="mt-3 max-w-[28rem] text-sm leading-7 text-slate-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

function SmartSummaryCard({
  categoryCount,
  totalMenuItems,
}: {
  categoryCount: number;
  totalMenuItems: number;
}) {
  return (
    <aside className="flex h-full flex-col rounded-[1.65rem] border border-[#e5d8c6] bg-[linear-gradient(160deg,rgba(255,247,236,0.98)_0%,rgba(246,231,206,0.9)_100%)] p-5 shadow-[0_18px_40px_rgba(125,89,43,0.08)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9a6c2c]">
        Cardapio Smart
      </p>
      <h2 className="mt-2 text-[1.4rem] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-950">
        Leitura rapida
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/72 px-3 py-2 text-sm font-medium text-slate-700">
          {categoryCount} categorias
        </span>
        <span className="rounded-full border border-white/70 bg-white/72 px-3 py-2 text-sm font-medium text-slate-700">
          {totalMenuItems} itens
        </span>
      </div>

      <p className="mt-4 max-w-[24rem] text-sm leading-7 text-slate-600">
        Experiencia interativa em tela cheia com foco em categorias, imagens e valores.
      </p>
    </aside>
  );
}

function FeatureIconPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="group inline-flex h-12 items-center rounded-full border border-slate-200/80 bg-white/84 px-3 text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-brand/20 hover:bg-white hover:text-slate-950"
      aria-label={label}
      title={label}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
        {icon}
      </span>
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[220px] group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

function OverlayInfoPill({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <button
      type="button"
      className="group inline-flex h-12 items-center self-start rounded-full border border-white/16 bg-white/12 px-3 text-white/82 backdrop-blur-md transition-all duration-300 hover:bg-white/18"
      aria-label={`${value} ${label}`}
      title={`${value} ${label}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-white">
        {icon}
      </span>
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[180px] group-hover:opacity-100">
        {value} {label}
      </span>
    </button>
  );
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
    <div className="mx-auto max-w-6xl space-y-12">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
        <ServiceCard
          eyebrow="Cafe da manha"
          title={restaurant.breakfastTitle}
          description={restaurant.breakfastDescription}
          icon={<Coffee className="h-5 w-5" />}
          toneClass="border-[#efe4cf] bg-[linear-gradient(160deg,rgba(255,251,243,0.98)_0%,rgba(248,239,220,0.9)_100%)]"
        />
        <ServiceCard
          eyebrow="A la carte"
          title={restaurant.aLaCarteTitle}
          description={restaurant.aLaCarteDescription}
          icon={<UtensilsCrossed className="h-5 w-5" />}
          toneClass="border-[#dbe5ef] bg-[linear-gradient(160deg,rgba(247,251,255,0.98)_0%,rgba(230,240,249,0.92)_100%)]"
        />
        <SmartSummaryCard
          categoryCount={menuCategories.length}
          totalMenuItems={totalMenuItems}
        />
      </section>

      <section>
        <article className="soft-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top,rgba(9,77,122,0.08),transparent_58%),radial-gradient(circle_at_bottom,rgba(184,157,116,0.09),transparent_48%)] lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(420px,1fr)] lg:items-center">
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
                <FeatureIconPill
                  icon={<ScrollText className="h-4 w-4" />}
                  label="Cardapio completo"
                />
                <FeatureIconPill
                  icon={<Expand className="h-4 w-4" />}
                  label="Navegacao em tela cheia"
                />
                <FeatureIconPill
                  icon={<ImagePlay className="h-4 w-4" />}
                  label="Leitura visual do cardapio"
                />
                <FeatureIconPill
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Experiencia mais imersiva"
                />
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(247,250,252,0.72)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[1.6rem]">
                <Image
                  src={restaurantImage}
                  alt="Destaque do restaurante"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-950/12 to-transparent" />

                <div className="absolute inset-x-5 top-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/18 bg-white/16 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    Cardapio Smart Express
                  </span>
                  <span className="rounded-full border border-white/18 bg-white/16 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/88 backdrop-blur-md">
                    Restaurante
                  </span>
                </div>

                <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/18 bg-slate-950/34 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                        Destaque visual
                      </p>
                      <p className="mt-2 max-w-[22rem] text-[1.7rem] leading-[0.96] font-semibold tracking-[-0.04em] text-white">
                        Cardapio Smart Express com uma leitura mais elegante e imersiva.
                      </p>
                      <p className="mt-4 max-w-[28rem] text-sm leading-7 text-white/80">
                        O menu abre com categorias, imagens, destaques e valores em uma experiencia pensada para parecer produto real.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:max-w-[220px] md:justify-end">
                      <OverlayInfoPill
                        icon={<LayoutGrid className="h-4 w-4" />}
                        value={String(menuCategories.length)}
                        label="categorias"
                      />
                      <OverlayInfoPill
                        icon={<Utensils className="h-4 w-4" />}
                        value={String(totalMenuItems)}
                        label="itens"
                      />
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
