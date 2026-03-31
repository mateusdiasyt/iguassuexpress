import { BlogPostStatus } from "@prisma/client";
import { z } from "zod";

const optionalString = z.string().optional().transform((value) => value?.trim() ?? "");

export const siteSettingsSchema = z.object({
  hotelName: z.string().min(2),
  whatsapp: z.string().min(8),
  phone: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  mapEmbed: optionalString,
  omnibeesHotelId: z.string().min(1),
  omnibeesBaseUrl: z.url(),
  logo: optionalString,
  favicon: optionalString,
  instagram: optionalString,
  facebook: optionalString,
  seoTitle: optionalString,
  seoDescription: optionalString,
  institutionalBio: optionalString,
});

export const pageContentSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(2),
  subtitle: optionalString,
  bannerImage: optionalString,
  seoTitle: optionalString,
  seoDescription: optionalString,
  content: optionalString,
  isPublished: z.boolean(),
});

export const roomCategorySchema = z.object({
  id: optionalString,
  name: z.string().min(2),
  slug: z.string().min(2),
  badge: optionalString,
  description: optionalString,
  heroImage: optionalString,
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const roomSchema = z.object({
  id: optionalString,
  categoryId: z.string().min(1),
  title: z.string().min(2),
  slug: z.string().min(2),
  occupancy: z.coerce.number().int().min(1).max(8),
  shortDescription: z.string().min(10),
  fullDescription: z.string().min(20),
  features: z.string(),
  coverImage: optionalString,
  gallery: z.string().optional(),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const restaurantSchema = z.object({
  heroImage: optionalString,
  teaserTitle: optionalString,
  teaserDescription: optionalString,
  breakfastTitle: z.string().min(2),
  breakfastDescription: z.string().min(10),
  aLaCarteTitle: z.string().min(2),
  aLaCarteDescription: z.string().min(10),
  images: z.string().optional(),
  isBreakfastActive: z.boolean(),
  isALaCarteActive: z.boolean(),
});

const optionalPrice = z.preprocess((value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}, z.number().nonnegative().max(999999).optional());

export const menuCategorySchema = z.object({
  id: optionalString,
  parentId: optionalString,
  name: z.string().min(2),
  slug: z.string().min(2),
  description: optionalString,
  heroImage: optionalString,
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const menuItemSchema = z.object({
  id: optionalString,
  categoryId: z.string().min(1),
  name: z.string().min(2),
  description: optionalString,
  price: optionalPrice,
  imageUrl: optionalString,
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const galleryImageSchema = z.object({
  id: optionalString,
  category: z.string().min(2),
  imageUrl: z.string().min(1),
  altText: z.string().min(2),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const tour360Schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  embedUrl: optionalString,
  heroImage: optionalString,
  gallery: z.string().optional(),
  isActive: z.boolean(),
});

export const locationSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  mapEmbed: optionalString,
  nearbyPoints: z.string().optional(),
  heroImage: optionalString,
  accessDetails: optionalString,
});

export const blogCategorySchema = z.object({
  id: optionalString,
  name: z.string().min(2),
  slug: z.string().min(2),
});

export const blogPostSchema = z.object({
  id: optionalString,
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  featuredImage: optionalString,
  categoryId: optionalString,
  seoTitle: optionalString,
  seoDescription: optionalString,
  status: z.nativeEnum(BlogPostStatus),
});

export const faqSchema = z.object({
  id: optionalString,
  question: z.string().min(5),
  answer: z.string().min(10),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const careerJobSchema = z.object({
  id: optionalString,
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});
