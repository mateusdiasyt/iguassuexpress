import { BlogCard } from "@/components/site/blog-card";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getBlogPosts, getPageContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("blog");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/blog",
    image: page.bannerImage,
  });
}

export default async function BlogPage() {
  const [page, posts] = await Promise.all([getPageContent("blog"), getBlogPosts()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </section>
    </div>
  );
}
