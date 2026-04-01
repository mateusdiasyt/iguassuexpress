"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Beer,
  ChevronRight,
  CupSoda,
  Droplets,
  IceCreamBowl,
  Leaf,
  Martini,
  Pizza,
  Play,
  Sandwich,
  ScrollText,
  Soup,
  Sparkles,
  UtensilsCrossed,
  Wine,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMenuCategories } from "@/data/queries";
import { cn } from "@/lib/utils";

type MenuCategories = Awaited<ReturnType<typeof getMenuCategories>>;
type MenuCategory = MenuCategories[number];
type MenuItem = MenuCategory["items"][number];

type RestaurantMenuDialogProps = {
  categories: MenuCategories;
  heroImage?: string | null;
  galleryImages?: string[];
  breakfastTitle?: string;
  aLaCarteTitle?: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number | null) {
  return value === null ? null : currencyFormatter.format(value);
}

function getCategoryIcon(slug: string) {
  if (slug.includes("vinho")) return <Wine className="h-4.5 w-4.5" />;
  if (slug.includes("cerveja")) return <Beer className="h-4.5 w-4.5" />;
  if (slug.includes("uisque") || slug.includes("caipir")) {
    return <Martini className="h-4.5 w-4.5" />;
  }
  if (slug.includes("agua")) return <Droplets className="h-4.5 w-4.5" />;
  if (slug.includes("refrigerante") || slug.includes("suco")) {
    return <CupSoda className="h-4.5 w-4.5" />;
  }
  if (slug.includes("sobremesa")) return <IceCreamBowl className="h-4.5 w-4.5" />;
  if (slug.includes("salada")) return <Leaf className="h-4.5 w-4.5" />;
  if (slug.includes("sopa")) return <Soup className="h-4.5 w-4.5" />;
  if (slug.includes("pizza")) return <Pizza className="h-4.5 w-4.5" />;
  if (slug.includes("lanche")) return <Sandwich className="h-4.5 w-4.5" />;
  if (slug.includes("especial")) return <Sparkles className="h-4.5 w-4.5" />;
  if (slug.includes("prato") || slug.includes("massa") || slug.includes("tapioca")) {
    return <UtensilsCrossed className="h-4.5 w-4.5" />;
  }

  return <ScrollText className="h-4.5 w-4.5" />;
}

function getCategoryItems(category: MenuCategory) {
  return [...category.items, ...category.children.flatMap((child) => child.items)];
}

function getPriceRange(category: MenuCategory) {
  const pricedItems = getCategoryItems(category)
    .map((item) => item.price)
    .filter((price): price is number => price !== null);

  if (!pricedItems.length) {
    return null;
  }

  return {
    min: Math.min(...pricedItems),
    max: Math.max(...pricedItems),
  };
}

function MenuCategoryButton({
  category,
  isActive,
  onSelect,
}: {
  category: MenuCategory;
  isActive: boolean;
  onSelect: () => void;
}) {
  const itemCount = getCategoryItems(category).length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group/menu-nav flex w-full min-w-[220px] items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition-all duration-300 lg:min-w-0",
        isActive
          ? "border-[#cdb28d] bg-[linear-gradient(180deg,rgba(255,252,248,0.98)_0%,rgba(247,238,226,0.96)_100%)] text-[#1f2b36] shadow-[0_18px_40px_rgba(84,61,33,0.12)]"
          : "border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,250,0.96)_0%,rgba(249,242,233,0.92)_100%)] text-[#53616d] hover:border-[#d4b891] hover:bg-[linear-gradient(180deg,rgba(255,252,248,1)_0%,rgba(247,239,228,0.96)_100%)] hover:shadow-[0_14px_30px_rgba(84,61,33,0.08)]",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
          isActive
            ? "border-[#dcc8a9] bg-[#f6ecdc] text-[#8d6d42]"
            : "border-[#e3d7c7] bg-white/72 text-[#8a7961] group-hover/menu-nav:text-[#6d5434]",
        )}
      >
        {getCategoryIcon(category.slug)}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-[-0.02em]">{category.name}</p>
        <p className="mt-1 text-[0.72rem] uppercase tracking-[0.22em] text-[#8a7761]">
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </p>
      </div>

      <ChevronRight
        className={cn(
          "ml-auto h-4 w-4 shrink-0 transition duration-300",
          isActive ? "text-[#8d6d42]" : "text-[#b7a086] group-hover/menu-nav:translate-x-0.5 group-hover/menu-nav:text-[#8d6d42]",
        )}
      />
    </button>
  );
}

function MenuItemCard({
  item,
  categoryName,
  fallbackImage,
  onFocusItem,
  delay,
}: {
  item: MenuItem;
  categoryName: string;
  fallbackImage?: string | null;
  onFocusItem: () => void;
  delay: number;
}) {
  const priceLabel = formatCurrency(item.price);
  const previewImage = item.imageUrl ?? fallbackImage;

  return (
    <button
      type="button"
      onMouseEnter={onFocusItem}
      onFocus={onFocusItem}
      className="restaurant-menu-card-enter group relative overflow-hidden rounded-[1.7rem] border border-[#e6d9c8] bg-[linear-gradient(180deg,rgba(255,253,249,0.98)_0%,rgba(249,242,233,0.94)_100%)] p-4 text-left shadow-[0_18px_40px_rgba(84,61,33,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d1b58f] hover:shadow-[0_24px_50px_rgba(84,61,33,0.12)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,198,162,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(184,157,116,0.14),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
            {categoryName}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#213243]">
            {item.name}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#66727f]">{item.description}</p>
        </div>

        {previewImage ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.15rem] border border-[#e0d2bf] bg-white/70 shadow-[0_10px_18px_rgba(70,49,24,0.08)]">
            <Image src={previewImage} alt={item.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-[#1f2b36]/8" />
          </div>
        ) : null}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e2d3bf] bg-white/78 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-[#766247]">
          Detalhes
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>

        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1.5 text-sm font-semibold tracking-[-0.01em]",
            priceLabel
              ? "bg-[#d8c6a2] text-[#1d2733]"
              : "border border-[#e2d3bf] bg-white/78 text-[#766247]",
          )}
        >
          {priceLabel ?? "Opção complementar"}
        </span>
      </div>
    </button>
  );
}

export function RestaurantMenuDialog({
  categories,
  heroImage,
  galleryImages = [],
  breakfastTitle,
  aLaCarteTitle,
}: RestaurantMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(categories[0]?.slug ?? "");
  const deferredSelectedSlug = useDeferredValue(selectedSlug);
  const [focusedItemSlug, setFocusedItemSlug] = useState<string | null>(null);
  const [introPhase, setIntroPhase] = useState<"hidden" | "loading" | "closing">("hidden");
  const introTimerRef = useRef<number | null>(null);
  const introHideTimerRef = useRef<number | null>(null);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.slug === deferredSelectedSlug) ?? categories[0] ?? null,
    [categories, deferredSelectedSlug],
  );

  const allCategoryItems = useMemo(
    () => (selectedCategory ? getCategoryItems(selectedCategory) : []),
    [selectedCategory],
  );

  const previewItem = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }

    return (
      allCategoryItems.find((item) => item.slug === focusedItemSlug) ??
      allCategoryItems[0] ??
      null
    );
  }, [allCategoryItems, focusedItemSlug, selectedCategory]);

  const previewImage =
    previewItem?.imageUrl ??
    selectedCategory?.heroImage ??
    galleryImages[0] ??
    heroImage ??
    null;

  const priceRange = selectedCategory ? getPriceRange(selectedCategory) : null;

  function selectCategory(category: MenuCategory) {
    const firstItemSlug = getCategoryItems(category)[0]?.slug ?? null;

    startTransition(() => {
      setSelectedSlug(category.slug);
      setFocusedItemSlug(firstItemSlug);
    });
  }

  function clearIntroTimers() {
    if (introTimerRef.current) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (introHideTimerRef.current) {
      window.clearTimeout(introHideTimerRef.current);
      introHideTimerRef.current = null;
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    clearIntroTimers();
    setOpen(nextOpen);

    if (!nextOpen) {
      setIntroPhase("hidden");
      return;
    }

    setIntroPhase("loading");

    introTimerRef.current = window.setTimeout(() => {
      setIntroPhase("closing");
      introTimerRef.current = null;
    }, 2600);

    introHideTimerRef.current = window.setTimeout(() => {
      setIntroPhase("hidden");
      introHideTimerRef.current = null;
    }, 3000);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      clearIntroTimers();
    };
  }, []);

  if (!categories.length || !selectedCategory) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="h-14 gap-3 rounded-full pl-2 pr-6 text-sm normal-case tracking-normal shadow-[0_18px_38px_rgba(9,77,122,0.28)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
          <span className="text-base font-semibold text-white">Iniciar cardápio</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="restaurant-menu-overlay fixed inset-0 z-[90] bg-[rgba(48,34,19,0.28)] backdrop-blur-xl" />

        <Dialog.Content className="restaurant-menu-shell fixed inset-0 z-[100] p-3 sm:p-5 lg:p-7">
          <div className="restaurant-menu-panel relative mx-auto flex h-full max-w-[1460px] overflow-hidden rounded-[2rem] border border-[#e9dece] bg-[linear-gradient(180deg,#f6efe3_0%,#f1e5d5_52%,#eadcc8_100%)] shadow-[0_36px_110px_rgba(65,47,27,0.16)]">
            {introPhase !== "hidden" ? (
              <div
                className={cn(
                  "absolute inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,252,247,0.88),rgba(243,231,214,0.8)_52%,rgba(232,215,192,0.72)_100%)] px-6 text-center backdrop-blur-md transition-opacity duration-500",
                  introPhase === "loading" ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(9,77,122,0.08),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(190,163,123,0.18),transparent_28%),linear-gradient(90deg,rgba(208,186,154,0.12)_0,rgba(208,186,154,0.12)_1px,transparent_1px,transparent_100%)] bg-[length:auto,auto,240px_100%]" />
                <div className="restaurant-menu-loader-glow absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(189,157,110,0.2),transparent_68%)] blur-3xl" />

                <div className="relative z-10 flex max-w-[28rem] flex-col items-center">
                  <div className="restaurant-menu-loader-mark relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dcc7a4]/70 bg-white/72 shadow-[0_22px_44px_rgba(84,61,33,0.12)]">
                    <span className="restaurant-menu-loader-ring absolute inset-2 rounded-full border border-[#d9c3a0]/75" />
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-deep shadow-[0_18px_32px_rgba(6,45,71,0.26)]">
                      <Image
                        src="/favicon-hotel.png"
                        alt="Iguassu Express Hotel"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        priority
                      />
                    </span>
                  </div>

                  <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8d6d42]">
                    Restaurante
                  </p>
                  <h2 className="mt-3 text-[2.15rem] leading-[0.94] font-semibold tracking-[-0.05em] text-[#182633] sm:text-[2.75rem]">
                    Cardápio Smart carregando
                  </h2>
                  <p className="mt-4 max-w-[24rem] text-sm leading-7 text-[#5c6974] sm:text-base">
                    Preparando a experiência do restaurante com categorias, destaques e leitura interativa.
                  </p>

                  <div className="mt-7 flex items-center gap-2">
                    <span className="restaurant-menu-loader-dot" />
                    <span className="restaurant-menu-loader-dot" style={{ animationDelay: "140ms" }} />
                    <span className="restaurant-menu-loader-dot" style={{ animationDelay: "280ms" }} />
                  </div>
                </div>
              </div>
            ) : null}

            <aside
              className={cn(
                "hidden w-[280px] shrink-0 border-r border-[#eadfce] bg-[linear-gradient(180deg,rgba(250,244,236,0.94)_0%,rgba(244,235,222,0.82)_100%)] p-7 transition duration-500 lg:flex lg:flex-col",
                introPhase !== "hidden" ? "scale-[0.985] blur-[10px] opacity-35" : "scale-100 blur-0 opacity-100",
              )}
            >
              <div className="rounded-[1.8rem] border border-[#e9dece] bg-[linear-gradient(160deg,rgba(255,253,250,0.98),rgba(248,240,228,0.92))] p-5 shadow-[0_20px_46px_rgba(84,61,33,0.08)]">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8d6d42]">
                  Menu interativo
                </p>
                <h2 className="mt-3 text-[1.9rem] leading-[0.94] font-semibold tracking-[-0.05em] text-[#1f2b36]">
                  Cardápio do restaurante
                </h2>
                <p className="mt-4 text-sm leading-8 text-[#6d7882]">
                  Navegue pelas categorias e valores do nosso menu interativo.
                </p>
              </div>

              <div className="restaurant-menu-scroll mt-5 space-y-2 overflow-y-auto pr-2">
                {categories.map((category) => (
                  <MenuCategoryButton
                    key={category.id}
                    category={category}
                    isActive={selectedCategory.slug === category.slug}
                    onSelect={() => selectCategory(category)}
                  />
                ))}
              </div>

              <div className="mt-5 rounded-[1.8rem] border border-[#e8dccd] bg-[linear-gradient(180deg,rgba(255,253,250,0.92)_0%,rgba(248,240,228,0.82)_100%)] p-5 shadow-[0_14px_32px_rgba(84,61,33,0.06)]">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
                    Serviço
                  </p>
                  <p className="mt-3 text-base leading-8 text-[#5d6975]">
                    {breakfastTitle ?? "Café da manhã"} e {aLaCarteTitle ?? "à la carte"} no restaurante do hotel.
                  </p>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-[#6d7882]">
                  <div className="rounded-[1.25rem] border border-[#eadfce] bg-white/78 px-4 py-3">
                    {allCategoryItems.length} opções nesta categoria
                  </div>
                  <div className="rounded-[1.25rem] border border-[#eadfce] bg-white/78 px-4 py-3">
                    Navegação pensada para leitura clara e rápida
                  </div>
                </div>
              </div>
            </aside>

            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col transition duration-500",
                introPhase !== "hidden" ? "scale-[0.99] blur-[10px] opacity-35" : "scale-100 blur-0 opacity-100",
              )}
            >
              <header className="flex items-center justify-between gap-4 border-b border-[#eadfce] px-6 py-7 sm:px-7 lg:px-9">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8d6d42]">
                    Restaurante
                  </p>
                  <Dialog.Title className="mt-2 text-[1.85rem] font-semibold tracking-[-0.05em] text-[#182633] sm:text-[2.05rem]">
                    Experiência de cardápio
                  </Dialog.Title>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfcfb8] bg-white/82 text-[#786347] transition hover:border-[#c9b18d] hover:bg-white hover:text-[#3b4b5a]"
                    aria-label="Fechar cardápio"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </Dialog.Close>
              </header>

              <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5 lg:p-6">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                  {categories.map((category) => (
                    <MenuCategoryButton
                      key={category.id}
                      category={category}
                      isActive={selectedCategory.slug === category.slug}
                      onSelect={() => selectCategory(category)}
                    />
                  ))}
                </div>

                <div className="min-h-0 flex-1 xl:px-2 xl:pb-2">
                  <div className="restaurant-menu-scroll min-h-0 space-y-5 overflow-y-auto pr-2">
                    <section
                      key={selectedCategory.slug}
                      className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[linear-gradient(140deg,rgba(255,253,250,0.98)_0%,rgba(249,242,233,0.94)_100%)] shadow-[0_24px_60px_rgba(84,61,33,0.08)]"
                    >
                      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,0.92fr)_420px] xl:p-7">
                        <div className="flex flex-col justify-between">
                          <div>
                            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8d6d42]">
                              Categoria selecionada
                            </p>
                            <h3 className="mt-4 text-[2.2rem] leading-[0.92] font-semibold tracking-[-0.05em] text-[#182633] sm:text-[2.9rem]">
                              {selectedCategory.name}
                            </h3>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#58636f] sm:text-base">
                              {selectedCategory.description ??
                                "Uma seleção pensada para manter o cardápio claro, elegante e fácil de explorar no ambiente do hotel."}
                            </p>
                          </div>

                          <div className="mt-8 flex flex-wrap gap-3">
                            <span className="rounded-[1.15rem] border border-[#eadfce] bg-white/80 px-4 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                              {allCategoryItems.length} opções disponíveis
                            </span>
                            {selectedCategory.children.length ? (
                              <span className="rounded-[1.15rem] border border-[#eadfce] bg-white/80 px-4 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                                {selectedCategory.children.length} blocos internos
                              </span>
                            ) : null}
                            {priceRange ? (
                              <span className="rounded-[1.15rem] border border-[#cfb58e] bg-[#f2e1c5] px-4 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-[#755a33]">
                                De {currencyFormatter.format(priceRange.min)} a{" "}
                                {currencyFormatter.format(priceRange.max)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[1.85rem] border border-[#e2d4c1] bg-[#f4e8d7] shadow-[0_18px_38px_rgba(84,61,33,0.1)]">
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={previewItem?.name ?? selectedCategory.name}
                              fill
                              className="object-cover transition duration-500"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,236,0.08)_0%,rgba(37,50,66,0.18)_55%,rgba(31,43,54,0.72)_100%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,244,225,0.32),transparent_28%),radial-gradient(circle_at_right,rgba(215,198,162,0.2),transparent_34%)]" />

                          <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#f1dec1]">
                              Destaque do momento
                            </p>
                            <h4 className="mt-3 text-[1.7rem] leading-[0.95] font-semibold tracking-[-0.04em] text-white">
                              {previewItem?.name ?? selectedCategory.name}
                            </h4>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/72">
                              {previewItem?.description ??
                                "Explore os itens da categoria e descubra combinações pensadas para diferentes momentos da hospedagem."}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                              {previewItem?.price !== null && previewItem?.price !== undefined ? (
                                <span className="inline-flex rounded-full bg-[#d8c6a2] px-4 py-2 text-sm font-semibold tracking-[-0.01em] text-[#1b2733]">
                                  {currencyFormatter.format(previewItem.price)}
                                </span>
                              ) : null}
                              <span className="inline-flex rounded-full border border-white/14 bg-white/14 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/72">
                                Passe o mouse ou toque nos cards
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {selectedCategory.items.length ? (
                      <section className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
                              Itens principais
                            </p>
                            <h4 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#182633]">
                              Seleções desta categoria
                            </h4>
                          </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-2">
                          {selectedCategory.items.map((item, index) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              categoryName={selectedCategory.name}
                              fallbackImage={item.imageUrl ?? selectedCategory.heroImage}
                              onFocusItem={() => setFocusedItemSlug(item.slug)}
                              delay={index * 45}
                            />
                          ))}
                        </div>
                      </section>
                    ) : null}

                    {selectedCategory.children.map((child, childIndex) => (
                      <section key={child.id} className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
                              Bloco complementar
                            </p>
                            <h4 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#182633]">
                              {child.name}
                            </h4>
                          </div>
                          <span className="rounded-full border border-[#e2d4c2] bg-white/76 px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                            {child.items.length} opções
                          </span>
                        </div>

                        {child.description ? (
                          <p className="max-w-2xl text-sm leading-7 text-[#68737f]">{child.description}</p>
                        ) : null}

                        <div className="grid gap-4 xl:grid-cols-2">
                          {child.items.map((item, index) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              categoryName={child.name}
                              fallbackImage={item.imageUrl ?? child.heroImage ?? selectedCategory.heroImage}
                              onFocusItem={() => setFocusedItemSlug(item.slug)}
                              delay={(childIndex + index + 1) * 45}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
