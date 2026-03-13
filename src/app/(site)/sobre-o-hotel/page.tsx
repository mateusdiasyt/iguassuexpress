import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPageContent, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("about");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/sobre-o-hotel",
    image: page.bannerImage,
  });
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPageContent("about"), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="soft-card rounded-[1.8rem] p-8">
          <SectionHeading
            eyebrow="Hospitalidade"
            title="Uma proposta contemporanea para lazer e negocios"
            description={settings.institutionalBio ?? page.subtitle ?? ""}
          />
        </article>
        <article className="soft-card rounded-[1.8rem] p-8">
          <RichText content={getContentBody(page.content)} />
        </article>
      </section>
    </div>
  );
}
