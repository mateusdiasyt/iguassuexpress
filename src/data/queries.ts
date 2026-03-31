import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  defaultBlogCategories,
  defaultBlogPosts,
  defaultCareerJobs,
  defaultFaqItems,
  defaultGalleryImages,
  defaultLocationContent,
  defaultPages,
  defaultRestaurantContent,
  defaultRoomCategories,
  defaultSiteSettings,
  defaultTour360Content,
} from "@/data/defaults";
import { buildDefaultMenuCategories } from "@/data/menu-catalog";

const databaseUrl = process.env.DATABASE_URL ?? "";
const hasConfiguredDatabase = Boolean(
  databaseUrl &&
    !databaseUrl.includes("USER:PASSWORD@HOST/DB") &&
    !databaseUrl.includes("localhost:5432/mydb"),
);

function pageFallback(key: string) {
  return (
    defaultPages.find((page) => page.key === key) ??
    defaultPages.find((page) => page.key === "home")!
  );
}

function mapMenuItem(item: {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: { toNumber(): number } | number | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}) {
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price:
      item.price === null
        ? null
        : typeof item.price === "number"
          ? item.price
          : item.price.toNumber(),
    imageUrl: item.imageUrl,
    order: item.order,
    isActive: item.isActive,
  };
}

function mapMenuCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
  items: Array<{
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string | null;
    price: { toNumber(): number } | number | null;
    imageUrl: string | null;
    order: number;
    isActive: boolean;
  }>;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    heroImage: string | null;
    order: number;
    isActive: boolean;
    parentId: string | null;
    items: Array<{
      id: string;
      categoryId: string;
      name: string;
      slug: string;
      description: string | null;
      price: { toNumber(): number } | number | null;
      imageUrl: string | null;
      order: number;
      isActive: boolean;
    }>;
  }>;
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    heroImage: category.heroImage,
    order: category.order,
    isActive: category.isActive,
    parentId: category.parentId,
    items: category.items.map(mapMenuItem),
    children: category.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      description: child.description,
      heroImage: child.heroImage,
      order: child.order,
      isActive: child.isActive,
      parentId: child.parentId,
      items: child.items.map(mapMenuItem),
      children: [],
    })),
  };
}

export async function getSiteSettings() {
  if (!hasConfiguredDatabase) {
    return defaultSiteSettings;
  }

  try {
    return (await prisma.siteSettings.findUnique({ where: { id: 1 } })) ?? defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export async function getPageContents() {
  if (!hasConfiguredDatabase) {
    return defaultPages;
  }

  try {
    const pages = await prisma.pageContent.findMany({
      orderBy: { key: "asc" },
    });

    return pages.length ? pages : defaultPages;
  } catch {
    return defaultPages;
  }
}

export async function getPageContent(key: string) {
  if (!hasConfiguredDatabase) {
    return pageFallback(key);
  }

  try {
    return (await prisma.pageContent.findUnique({ where: { key } })) ?? pageFallback(key);
  } catch {
    return pageFallback(key);
  }
}

export async function getRoomCategories(includeInactive = false) {
  if (!hasConfiguredDatabase) {
    return defaultRoomCategories;
  }

  try {
    const categories = await prisma.roomCategory.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        rooms: {
          where: includeInactive ? undefined : { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return categories.length ? categories : defaultRoomCategories;
  } catch {
    return defaultRoomCategories;
  }
}

export async function getRestaurantContent() {
  if (!hasConfiguredDatabase) {
    return defaultRestaurantContent;
  }

  try {
    return (
      (await prisma.restaurantContent.findUnique({
        where: { id: 1 },
      })) ?? defaultRestaurantContent
    );
  } catch {
    return defaultRestaurantContent;
  }
}

export async function getMenuCategories(includeInactive = false) {
  if (!hasConfiguredDatabase) {
    return includeInactive
      ? buildDefaultMenuCategories()
      : buildDefaultMenuCategories().filter((category) => category.isActive);
  }

  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        parentId: null,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        items: {
          where: includeInactive ? undefined : { isActive: true },
          orderBy: { order: "asc" },
        },
        children: {
          where: includeInactive ? undefined : { isActive: true },
          include: {
            items: {
              where: includeInactive ? undefined : { isActive: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return categories.length ? categories.map(mapMenuCategory) : buildDefaultMenuCategories();
  } catch {
    return buildDefaultMenuCategories();
  }
}

export async function getGalleryImages(includeInactive = false) {
  if (!hasConfiguredDatabase) {
    return includeInactive
      ? defaultGalleryImages
      : defaultGalleryImages.filter((item) => item.isActive);
  }

  try {
    const items = await prisma.galleryImage.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return items.length ? items : defaultGalleryImages;
  } catch {
    return defaultGalleryImages;
  }
}

export async function getTour360Content() {
  if (!hasConfiguredDatabase) {
    return defaultTour360Content;
  }

  try {
    return (
      (await prisma.tour360Content.findUnique({
        where: { id: 1 },
      })) ?? defaultTour360Content
    );
  } catch {
    return defaultTour360Content;
  }
}

export async function getLocationContent() {
  if (!hasConfiguredDatabase) {
    return defaultLocationContent;
  }

  try {
    return (
      (await prisma.locationContent.findUnique({
        where: { id: 1 },
      })) ?? defaultLocationContent
    );
  } catch {
    return defaultLocationContent;
  }
}

export async function getBlogCategories() {
  if (!hasConfiguredDatabase) {
    return defaultBlogCategories;
  }

  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
    });

    return categories.length ? categories : defaultBlogCategories;
  } catch {
    return defaultBlogCategories;
  }
}

export async function getBlogPosts(includeDrafts = false) {
  if (!hasConfiguredDatabase) {
    return defaultBlogPosts.map((post) => ({
      ...post,
      category: defaultBlogCategories[0],
    }));
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: includeDrafts ? undefined : { status: BlogPostStatus.PUBLISHED },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });

    return posts.length
      ? posts
      : defaultBlogPosts.map((post) => ({
          ...post,
          category: defaultBlogCategories[0],
        }));
  } catch {
    return defaultBlogPosts.map((post) => ({
      ...post,
      category: defaultBlogCategories[0],
    }));
  }
}

export async function getBlogPostBySlug(slug: string) {
  if (!hasConfiguredDatabase) {
    return (
      defaultBlogPosts
        .filter((post) => post.slug === slug)
        .map((post) => ({ ...post, category: defaultBlogCategories[0] }))[0] ??
      null
    );
  }

  try {
    return (
      (await prisma.blogPost.findUnique({
        where: { slug },
        include: { category: true },
      })) ??
      defaultBlogPosts
        .filter((post) => post.slug === slug)
        .map((post) => ({ ...post, category: defaultBlogCategories[0] }))[0] ??
      null
    );
  } catch {
    return (
      defaultBlogPosts
        .filter((post) => post.slug === slug)
        .map((post) => ({ ...post, category: defaultBlogCategories[0] }))[0] ??
      null
    );
  }
}

export async function getFaqItems(includeInactive = false) {
  if (!hasConfiguredDatabase) {
    return includeInactive ? defaultFaqItems : defaultFaqItems.filter((item) => item.isActive);
  }

  try {
    const faqs = await prisma.faqItem.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { order: "asc" },
    });

    return faqs.length ? faqs : defaultFaqItems;
  } catch {
    return defaultFaqItems;
  }
}

export async function getCareerJobs(includeInactive = false) {
  if (!hasConfiguredDatabase) {
    return defaultCareerJobs;
  }

  try {
    const jobs = await prisma.careerJob.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { order: "asc" },
    });

    return jobs.length ? jobs : defaultCareerJobs;
  } catch {
    return defaultCareerJobs;
  }
}

export async function getContactMessages() {
  if (!hasConfiguredDatabase) {
    return [];
  }

  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCareerApplications() {
  if (!hasConfiguredDatabase) {
    return [];
  }

  try {
    return await prisma.careerApplication.findMany({
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getAdminDashboardStats() {
  if (!hasConfiguredDatabase) {
    return {
      posts: defaultBlogPosts.length,
      messages: 0,
      applications: 0,
      rooms: defaultRoomCategories.flatMap((category) => category.rooms).length,
      faqs: defaultFaqItems.length,
    };
  }

  try {
    const [posts, messages, applications, rooms, faqs] = await Promise.all([
      prisma.blogPost.count(),
      prisma.contactMessage.count(),
      prisma.careerApplication.count(),
      prisma.room.count(),
      prisma.faqItem.count(),
    ]);

    return { posts, messages, applications, rooms, faqs };
  } catch {
    return {
      posts: defaultBlogPosts.length,
      messages: 0,
      applications: 0,
      rooms: defaultRoomCategories.flatMap((category) => category.rooms).length,
      faqs: defaultFaqItems.length,
    };
  }
}
