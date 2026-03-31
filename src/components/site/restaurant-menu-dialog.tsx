"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
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
        "group/menu-nav flex w-full min-w-[220px] items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition-all duration-300 lg:min-w-0",
        isActive
          ? "border-[#b89d74]/45 bg-[linear-gradient(180deg,rgba(255,248,236,0.96)_0%,rgba(244,233,216,0.94)_100%)] text-[#1f2b36] shadow-[0_18px_40px_rgba(70,49,24,0.14)]"
          : "border-[#d9c9b3] bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(247,239,227,0.88)_100%)] text-[#4c5a67] hover:border-[#c9b18d] hover:bg-[linear-gradient(180deg,rgba(255,249,240,0.98)_0%,rgba(245,235,219,0.94)_100%)]",
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
      className="restaurant-menu-card-enter group relative overflow-hidden rounded-[1.65rem] border border-[#dfd0bb] bg-[linear-gradient(180deg,rgba(255,252,247,0.96)_0%,rgba(247,239,227,0.92)_100%)] p-4 text-left shadow-[0_18px_40px_rgba(70,49,24,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#c9b18d] hover:shadow-[0_24px_50px_rgba(70,49,24,0.14)]"
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
          {priceLabel ?? "Opcao complementar"}
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

  if (!categories.length || !selectedCategory) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="h-12 px-5 text-sm normal-case tracking-normal shadow-[0_18px_38px_rgba(9,77,122,0.28)]">
          Ver cardapio
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="restaurant-menu-overlay fixed inset-0 z-[90] bg-[rgba(48,34,19,0.28)] backdrop-blur-xl" />

        <Dialog.Content className="restaurant-menu-shell fixed inset-0 z-[100] p-3 sm:p-5 lg:p-7">
          <div className="restaurant-menu-panel mx-auto flex h-full max-w-[1380px] overflow-hidden rounded-[2rem] border border-[#e2d6c6] bg-[linear-gradient(180deg,#fbf5eb_0%,#f4eadc_48%,#efe3d1_100%)] shadow-[0_36px_110px_rgba(65,47,27,0.22)]">
            <aside className="hidden w-[280px] shrink-0 border-r border-[#e0d0bc] bg-[linear-gradient(180deg,rgba(248,240,228,0.96)_0%,rgba(241,230,213,0.88)_100%)] p-5 lg:flex lg:flex-col">
              <div className="rounded-[1.7rem] border border-[#e1d3c0] bg-[linear-gradient(160deg,rgba(255,252,247,0.98),rgba(247,237,223,0.92))] p-4 shadow-[0_18px_44px_rgba(70,49,24,0.1)]">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8d6d42]">
                  Menu interativo
                </p>
                <h2 className="mt-3 text-[1.65rem] leading-[0.92] font-semibold tracking-[-0.04em] text-[#1f2b36]">
                  Cardapio do restaurante
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6d7882]">
                  Navegue pelas categorias, veja os valores e sinta o ambiente do menu em tela cheia.
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

              <div className="mt-5 grid gap-3 rounded-[1.6rem] border border-[#e1d3c0] bg-[linear-gradient(180deg,rgba(255,252,247,0.9)_0%,rgba(247,237,223,0.78)_100%)] p-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
                    Servico
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6d7882]">
                    {breakfastTitle ?? "Cafe da manha"} e {aLaCarteTitle ?? "A la carte"} dentro do hotel.
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-[#6d7882]">
                  <div className="rounded-[1.2rem] border border-[#e6dac8] bg-white/76 px-3 py-3">
                    {allCategoryItems.length} opcoes nesta categoria
                  </div>
                  <div className="rounded-[1.2rem] border border-[#e6dac8] bg-white/76 px-3 py-3">
                    Layout pensado para leitura rapida e visual premium
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex min-h-0 flex-1 flex-col">
              <header className="flex items-center justify-between gap-4 border-b border-[#dfd1be] px-4 py-4 sm:px-5 lg:px-6">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8d6d42]">
                    Restaurante
                  </p>
                  <Dialog.Title className="mt-2 text-[1.6rem] font-semibold tracking-[-0.04em] text-[#1f2b36] sm:text-[1.9rem]">
                    Experiencia de cardapio
                  </Dialog.Title>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfcfb8] bg-white/82 text-[#786347] transition hover:border-[#c9b18d] hover:bg-white hover:text-[#3b4b5a]"
                    aria-label="Fechar cardapio"
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

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="restaurant-menu-scroll min-h-0 space-y-4 overflow-y-auto pr-2">
                    <section
                      key={selectedCategory.slug}
                      className="overflow-hidden rounded-[1.95rem] border border-[#dfd0bc] bg-[linear-gradient(140deg,rgba(255,252,247,0.98)_0%,rgba(246,236,220,0.94)_100%)] shadow-[0_24px_60px_rgba(70,49,24,0.1)]"
                    >
                      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.02fr)_390px] xl:p-6">
                        <div className="flex flex-col justify-between">
                          <div>
                            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8d6d42]">
                              Categoria selecionada
                            </p>
                            <h3 className="mt-4 text-[2.2rem] leading-[0.92] font-semibold tracking-[-0.05em] text-[#1f2b36] sm:text-[2.9rem]">
                              {selectedCategory.name}
                            </h3>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#68737f] sm:text-base">
                              {selectedCategory.description ??
                                "Uma selecao pensada para manter o cardapio claro, elegante e facil de explorar no ambiente do hotel."}
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full border border-[#e2d4c2] bg-white/76 px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                              {allCategoryItems.length} opcoes disponiveis
                            </span>
                            {selectedCategory.children.length ? (
                              <span className="rounded-full border border-[#e2d4c2] bg-white/76 px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                                {selectedCategory.children.length} blocos internos
                              </span>
                            ) : null}
                            {priceRange ? (
                              <span className="rounded-full border border-[#cfb58e] bg-[#f2e1c5] px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#755a33]">
                                De {currencyFormatter.format(priceRange.min)} a{" "}
                                {currencyFormatter.format(priceRange.max)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#ddcbb4] bg-[#f4e8d7] shadow-[0_16px_34px_rgba(70,49,24,0.1)]">
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

                          <div className="relative flex h-full min-h-[300px] flex-col justify-end p-5">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#f1dec1]">
                              Destaque do momento
                            </p>
                            <h4 className="mt-3 text-[1.7rem] leading-[0.95] font-semibold tracking-[-0.04em] text-white">
                              {previewItem?.name ?? selectedCategory.name}
                            </h4>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/72">
                              {previewItem?.description ??
                                "Explore os itens da categoria e descubra combinacoes pensadas para diferentes momentos da hospedagem."}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
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
                            <h4 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1f2b36]">
                              Selecoes desta categoria
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
                            <h4 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1f2b36]">
                              {child.name}
                            </h4>
                          </div>
                          <span className="rounded-full border border-[#e2d4c2] bg-white/76 px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#6d7882]">
                            {child.items.length} opcoes
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

                  <aside className="hidden xl:block">
                    <div className="sticky top-0 space-y-4 rounded-[1.8rem] border border-[#e0d0bc] bg-[linear-gradient(180deg,rgba(248,240,228,0.96)_0%,rgba(241,230,213,0.88)_100%)] p-4 shadow-[0_20px_48px_rgba(70,49,24,0.1)]">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d6d42]">
                          Leitura rapida
                        </p>
                        <h4 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1f2b36]">
                          Resumo da categoria
                        </h4>
                      </div>

                      <div className="grid gap-3">
                        <div className="rounded-[1.35rem] border border-[#e4d7c6] bg-white/78 p-4">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8a7761]">
                            Nome
                          </p>
                          <p className="mt-2 text-base font-semibold text-[#213243]">{selectedCategory.name}</p>
                        </div>

                        <div className="rounded-[1.35rem] border border-[#e4d7c6] bg-white/78 p-4">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8a7761]">
                            Total de itens
                          </p>
                          <p className="mt-2 text-base font-semibold text-[#213243]">{allCategoryItems.length}</p>
                        </div>

                        <div className="rounded-[1.35rem] border border-[#e4d7c6] bg-white/78 p-4">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8a7761]">
                            Faixa de preco
                          </p>
                          <p className="mt-2 text-base font-semibold text-[#213243]">
                            {priceRange
                              ? `${currencyFormatter.format(priceRange.min)} - ${currencyFormatter.format(priceRange.max)}`
                              : "Itens complementares"}
                          </p>
                        </div>

                        <div className="rounded-[1.35rem] border border-[#e4d7c6] bg-white/78 p-4">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8a7761]">
                            Servico
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#6d7882]">
                            Cardapio pensado para leitura rapida em recepcao, quarto ou restaurante.
                          </p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
