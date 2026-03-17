"use server";

import { BlogPostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseList, safeParseJson, toSlug } from "@/lib/utils";
import {
  blogCategorySchema,
  blogPostSchema,
  careerJobSchema,
  faqSchema,
  galleryImageSchema,
  locationSchema,
  pageContentSchema,
  restaurantSchema,
  roomCategorySchema,
  roomSchema,
  siteSettingsSchema,
  tour360Schema,
} from "@/schemas/admin";

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function refreshSite(paths: string[]) {
  for (const path of paths) {
    if (!path) {
      continue;
    }

    revalidatePath(path);
  }
}

function normalizePageContent(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { body: "" };
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return safeParseJson(trimmed, { body: "" });
  }

  return { body: trimmed };
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const parsed = siteSettingsSchema.parse({
    hotelName: getString(formData, "hotelName"),
    whatsapp: getString(formData, "whatsapp"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    address: getString(formData, "address"),
    mapEmbed: getString(formData, "mapEmbed"),
    omnibeesHotelId: getString(formData, "omnibeesHotelId"),
    omnibeesBaseUrl: getString(formData, "omnibeesBaseUrl"),
    logo: getString(formData, "logo"),
    favicon: getString(formData, "favicon"),
    instagram: getString(formData, "instagram"),
    facebook: getString(formData, "facebook"),
    seoTitle: getString(formData, "seoTitle"),
    seoDescription: getString(formData, "seoDescription"),
    institutionalBio: getString(formData, "institutionalBio"),
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      hotelName: parsed.hotelName,
      whatsapp: parsed.whatsapp,
      phone: parsed.phone,
      email: parsed.email,
      address: parsed.address,
      mapEmbed: parsed.mapEmbed || null,
      omnibeesHotelId: parsed.omnibeesHotelId,
      omnibeesBaseUrl: parsed.omnibeesBaseUrl,
      logo: parsed.logo || null,
      favicon: parsed.favicon || null,
      socialLinks: {
        instagram: parsed.instagram,
        facebook: parsed.facebook,
      },
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      institutionalBio: parsed.institutionalBio || null,
    },
    create: {
      id: 1,
      hotelName: parsed.hotelName,
      whatsapp: parsed.whatsapp,
      phone: parsed.phone,
      email: parsed.email,
      address: parsed.address,
      mapEmbed: parsed.mapEmbed || null,
      omnibeesHotelId: parsed.omnibeesHotelId,
      omnibeesBaseUrl: parsed.omnibeesBaseUrl,
      logo: parsed.logo || null,
      favicon: parsed.favicon || null,
      socialLinks: {
        instagram: parsed.instagram,
        facebook: parsed.facebook,
      },
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      institutionalBio: parsed.institutionalBio || null,
    },
  });

  refreshSite(["/", "/contato", "/admin/configuracoes", "/admin/seo"]);
}

export async function savePageContentAction(formData: FormData) {
  await requireAdmin();

  const parsed = pageContentSchema.parse({
    key: getString(formData, "key"),
    title: getString(formData, "title"),
    subtitle: getString(formData, "subtitle"),
    bannerImage: getString(formData, "bannerImage"),
    seoTitle: getString(formData, "seoTitle"),
    seoDescription: getString(formData, "seoDescription"),
    content: getString(formData, "content"),
    isPublished: getBoolean(formData, "isPublished"),
  });

  await prisma.pageContent.upsert({
    where: { key: parsed.key },
    update: {
      title: parsed.title,
      subtitle: parsed.subtitle || null,
      bannerImage: parsed.bannerImage || null,
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      content: normalizePageContent(parsed.content),
      isPublished: parsed.isPublished,
    },
    create: {
      key: parsed.key,
      title: parsed.title,
      subtitle: parsed.subtitle || null,
      bannerImage: parsed.bannerImage || null,
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      content: normalizePageContent(parsed.content),
      isPublished: parsed.isPublished,
    },
  });

  refreshSite([
    "/",
    "/apartamentos",
    "/restaurante",
    "/galeria-de-fotos",
    "/tour-360",
    "/localizacao",
    "/sobre-o-hotel",
    "/contato",
    "/blog",
    "/trabalhe-conosco",
    "/admin/paginas",
    "/admin/seo",
  ]);
}

export async function saveRoomCategoryAction(formData: FormData) {
  await requireAdmin();

  const parsed = roomCategorySchema.parse({
    id: getString(formData, "id"),
    name: getString(formData, "name"),
    slug: getString(formData, "slug") || toSlug(getString(formData, "name")),
    badge: getString(formData, "badge"),
    description: getString(formData, "description"),
    heroImage: getString(formData, "heroImage"),
    order: getString(formData, "order"),
    isActive: getBoolean(formData, "isActive"),
  });

  if (parsed.id) {
    await prisma.roomCategory.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        badge: parsed.badge || null,
        description: parsed.description || null,
        heroImage: parsed.heroImage || null,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  } else {
    await prisma.roomCategory.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        badge: parsed.badge || null,
        description: parsed.description || null,
        heroImage: parsed.heroImage || null,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  }

  refreshSite(["/", "/apartamentos", "/admin/quartos"]);
}

export async function deleteRoomCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.roomCategory.delete({
    where: { id },
  });

  refreshSite(["/", "/apartamentos", "/admin/quartos"]);
}

export async function saveRoomAction(formData: FormData) {
  await requireAdmin();

  const parsed = roomSchema.parse({
    id: getString(formData, "id"),
    categoryId: getString(formData, "categoryId"),
    title: getString(formData, "title"),
    slug: getString(formData, "slug") || toSlug(getString(formData, "title")),
    occupancy: getString(formData, "occupancy"),
    shortDescription: getString(formData, "shortDescription"),
    fullDescription: getString(formData, "fullDescription"),
    features: getString(formData, "features"),
    coverImage: getString(formData, "coverImage"),
    gallery: getString(formData, "gallery"),
    order: getString(formData, "order"),
    isActive: getBoolean(formData, "isActive"),
  });

  const data = {
    categoryId: parsed.categoryId,
    title: parsed.title,
    slug: parsed.slug,
    occupancy: parsed.occupancy,
    shortDescription: parsed.shortDescription,
    fullDescription: parsed.fullDescription,
    features: parseList(parsed.features),
    coverImage: parsed.coverImage || null,
    gallery: parseList(parsed.gallery ?? ""),
    order: parsed.order,
    isActive: parsed.isActive,
  };

  if (parsed.id) {
    await prisma.room.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    await prisma.room.create({
      data,
    });
  }

  refreshSite(["/", "/apartamentos", "/admin/quartos"]);
}

export async function deleteRoomAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.room.delete({
    where: { id },
  });

  refreshSite(["/", "/apartamentos", "/admin/quartos"]);
}

export async function saveRestaurantAction(formData: FormData) {
  await requireAdmin();

  const parsed = restaurantSchema.parse({
    heroImage: getString(formData, "heroImage"),
    teaserTitle: getString(formData, "teaserTitle"),
    teaserDescription: getString(formData, "teaserDescription"),
    breakfastTitle: getString(formData, "breakfastTitle"),
    breakfastDescription: getString(formData, "breakfastDescription"),
    aLaCarteTitle: getString(formData, "aLaCarteTitle"),
    aLaCarteDescription: getString(formData, "aLaCarteDescription"),
    images: getString(formData, "images"),
    isBreakfastActive: getBoolean(formData, "isBreakfastActive"),
    isALaCarteActive: getBoolean(formData, "isALaCarteActive"),
  });

  await prisma.restaurantContent.upsert({
    where: { id: 1 },
    update: {
      heroImage: parsed.heroImage || null,
      teaserTitle: parsed.teaserTitle || null,
      teaserDescription: parsed.teaserDescription || null,
      breakfastTitle: parsed.breakfastTitle,
      breakfastDescription: parsed.breakfastDescription,
      aLaCarteTitle: parsed.aLaCarteTitle,
      aLaCarteDescription: parsed.aLaCarteDescription,
      images: parseList(parsed.images ?? ""),
      isBreakfastActive: parsed.isBreakfastActive,
      isALaCarteActive: parsed.isALaCarteActive,
    },
    create: {
      id: 1,
      heroImage: parsed.heroImage || null,
      teaserTitle: parsed.teaserTitle || null,
      teaserDescription: parsed.teaserDescription || null,
      breakfastTitle: parsed.breakfastTitle,
      breakfastDescription: parsed.breakfastDescription,
      aLaCarteTitle: parsed.aLaCarteTitle,
      aLaCarteDescription: parsed.aLaCarteDescription,
      images: parseList(parsed.images ?? ""),
      isBreakfastActive: parsed.isBreakfastActive,
      isALaCarteActive: parsed.isALaCarteActive,
    },
  });

  refreshSite(["/", "/restaurante", "/admin/restaurante"]);
}

export async function saveGalleryImageAction(formData: FormData) {
  await requireAdmin();

  const parsed = galleryImageSchema.parse({
    id: getString(formData, "id"),
    category: getString(formData, "category"),
    imageUrl: getString(formData, "imageUrl"),
    altText: getString(formData, "altText"),
    order: getString(formData, "order"),
    isActive: getBoolean(formData, "isActive"),
  });

  if (parsed.id) {
    await prisma.galleryImage.update({
      where: { id: parsed.id },
      data: {
        category: parsed.category,
        imageUrl: parsed.imageUrl,
        altText: parsed.altText,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  } else {
    await prisma.galleryImage.create({
      data: {
        category: parsed.category,
        imageUrl: parsed.imageUrl,
        altText: parsed.altText,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  }

  refreshSite(["/", "/galeria-de-fotos", "/admin/galeria"]);
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.galleryImage.delete({
    where: { id },
  });

  refreshSite(["/", "/galeria-de-fotos", "/admin/galeria"]);
}

export async function saveTour360Action(formData: FormData) {
  await requireAdmin();

  const parsed = tour360Schema.parse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    embedUrl: getString(formData, "embedUrl"),
    heroImage: getString(formData, "heroImage"),
    gallery: getString(formData, "gallery"),
    isActive: getBoolean(formData, "isActive"),
  });

  await prisma.tour360Content.upsert({
    where: { id: 1 },
    update: {
      title: parsed.title,
      description: parsed.description,
      embedUrl: parsed.embedUrl || null,
      heroImage: parsed.heroImage || null,
      gallery: parseList(parsed.gallery ?? ""),
      isActive: parsed.isActive,
    },
    create: {
      id: 1,
      title: parsed.title,
      description: parsed.description,
      embedUrl: parsed.embedUrl || null,
      heroImage: parsed.heroImage || null,
      gallery: parseList(parsed.gallery ?? ""),
      isActive: parsed.isActive,
    },
  });

  refreshSite(["/", "/tour-360", "/admin/tour-360"]);
}

export async function saveLocationAction(formData: FormData) {
  await requireAdmin();

  const parsed = locationSchema.parse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    mapEmbed: getString(formData, "mapEmbed"),
    nearbyPoints: getString(formData, "nearbyPoints"),
    heroImage: getString(formData, "heroImage"),
    accessDetails: getString(formData, "accessDetails"),
  });

  await prisma.locationContent.upsert({
    where: { id: 1 },
    update: {
      title: parsed.title,
      description: parsed.description,
      mapEmbed: parsed.mapEmbed || null,
      nearbyPoints: parseList(parsed.nearbyPoints ?? ""),
      heroImage: parsed.heroImage || null,
      accessDetails: parsed.accessDetails || null,
    },
    create: {
      id: 1,
      title: parsed.title,
      description: parsed.description,
      mapEmbed: parsed.mapEmbed || null,
      nearbyPoints: parseList(parsed.nearbyPoints ?? ""),
      heroImage: parsed.heroImage || null,
      accessDetails: parsed.accessDetails || null,
    },
  });

  refreshSite(["/", "/localizacao", "/admin/localizacao"]);
}

export async function saveBlogCategoryAction(formData: FormData) {
  await requireAdmin();

  const parsed = blogCategorySchema.parse({
    id: getString(formData, "id"),
    name: getString(formData, "name"),
    slug: getString(formData, "slug") || toSlug(getString(formData, "name")),
  });

  if (parsed.id) {
    await prisma.blogCategory.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
      },
    });
  } else {
    await prisma.blogCategory.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
      },
    });
  }

  refreshSite(["/blog", "/admin/blog"]);
}

export async function deleteBlogCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.blogCategory.delete({
    where: { id },
  });

  refreshSite(["/blog", "/admin/blog"]);
}

export async function saveBlogPostAction(formData: FormData) {
  await requireAdmin();

  const parsed = blogPostSchema.parse({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    slug: getString(formData, "slug") || toSlug(getString(formData, "title")),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    featuredImage: getString(formData, "featuredImage"),
    categoryId: getString(formData, "categoryId"),
    seoTitle: getString(formData, "seoTitle"),
    seoDescription: getString(formData, "seoDescription"),
    status: (getString(formData, "status") || "DRAFT") as BlogPostStatus,
  });

  const existingPost = parsed.id
    ? await prisma.blogPost.findUnique({
        where: { id: parsed.id },
        select: {
          slug: true,
          publishedAt: true,
        },
      })
    : null;

  const data = {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    featuredImage: parsed.featuredImage || null,
    categoryId: parsed.categoryId || null,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
    status: parsed.status,
    publishedAt:
      parsed.status === BlogPostStatus.PUBLISHED
        ? existingPost?.publishedAt ?? new Date()
        : null,
  };

  if (parsed.id) {
    await prisma.blogPost.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    await prisma.blogPost.create({
      data,
    });
  }

  refreshSite([
    "/",
    "/blog",
    "/admin/blog",
    `/blog/${parsed.slug}`,
    existingPost?.slug && existingPost.slug !== parsed.slug ? `/blog/${existingPost.slug}` : "",
  ]);
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.blogPost.delete({
    where: { id },
  });

  refreshSite(["/", "/blog", "/admin/blog", post?.slug ? `/blog/${post.slug}` : ""]);
}

export async function saveFaqAction(formData: FormData) {
  await requireAdmin();

  const parsed = faqSchema.parse({
    id: getString(formData, "id"),
    question: getString(formData, "question"),
    answer: getString(formData, "answer"),
    order: getString(formData, "order"),
    isActive: getBoolean(formData, "isActive"),
  });

  if (parsed.id) {
    await prisma.faqItem.update({
      where: { id: parsed.id },
      data: {
        question: parsed.question,
        answer: parsed.answer,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  } else {
    await prisma.faqItem.create({
      data: {
        question: parsed.question,
        answer: parsed.answer,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  }

  refreshSite(["/", "/admin/faq"]);
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.faqItem.delete({
    where: { id },
  });

  refreshSite(["/", "/admin/faq"]);
}

export async function saveCareerJobAction(formData: FormData) {
  await requireAdmin();

  const parsed = careerJobSchema.parse({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    slug: getString(formData, "slug") || toSlug(getString(formData, "title")),
    description: getString(formData, "description"),
    order: getString(formData, "order"),
    isActive: getBoolean(formData, "isActive"),
  });

  if (parsed.id) {
    await prisma.careerJob.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  } else {
    await prisma.careerJob.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        order: parsed.order,
        isActive: parsed.isActive,
      },
    });
  }

  refreshSite(["/trabalhe-conosco", "/admin/trabalhe-conosco"]);
}

export async function deleteCareerJobAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) return;

  await prisma.careerJob.delete({
    where: { id },
  });

  refreshSite(["/trabalhe-conosco", "/admin/trabalhe-conosco"]);
}
