import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { menuCatalogSeed, type MenuCatalogSeedCategory } from "../src/data/menu-catalog";

const prisma = new PrismaClient();

function toSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

async function upsertCategory(
  category: MenuCatalogSeedCategory,
  order: number,
  parentId: string | null = null,
) {
  const savedCategory = await prisma.menuCategory.upsert({
    where: { slug: category.slug },
    update: {
      parentId,
      name: category.name,
      description: category.description,
      heroImage: category.heroImage ?? null,
      order,
      isActive: true,
    },
    create: {
      parentId,
      name: category.name,
      slug: category.slug,
      description: category.description,
      heroImage: category.heroImage ?? null,
      order,
      isActive: true,
    },
  });

  for (const [itemIndex, item] of (category.items ?? []).entries()) {
    const slug = toSlug(`${category.slug}-${item.name}`);

    await prisma.menuItem.upsert({
      where: { slug },
      update: {
        categoryId: savedCategory.id,
        name: item.name,
        description: item.description,
        price: item.price ?? null,
        imageUrl: item.imageUrl ?? null,
        order: itemIndex,
        isActive: true,
      },
      create: {
        categoryId: savedCategory.id,
        name: item.name,
        slug,
        description: item.description,
        price: item.price ?? null,
        imageUrl: item.imageUrl ?? null,
        order: itemIndex,
        isActive: true,
      },
    });
  }

  for (const [childIndex, child] of (category.children ?? []).entries()) {
    await upsertCategory(child, childIndex, savedCategory.id);
  }
}

async function main() {
  for (const [index, category] of menuCatalogSeed.entries()) {
    await upsertCategory(category, index);
  }

  console.log("Cardapio sincronizado com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
