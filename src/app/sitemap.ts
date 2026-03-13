import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/data/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getBlogPosts();
  const routes = [
    "",
    "/apartamentos",
    "/restaurante",
    "/galeria-de-fotos",
    "/tour-360",
    "/localizacao",
    "/sobre-o-hotel",
    "/contato",
    "/blog",
    "/trabalhe-conosco",
  ];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified:
        ("updatedAt" in post && post.updatedAt ? post.updatedAt : undefined) ??
        post.publishedAt ??
        new Date(),
    })),
  ];
}
