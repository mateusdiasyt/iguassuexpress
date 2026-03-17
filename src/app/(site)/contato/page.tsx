import { ContactSection } from "@/components/site/contact-section";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getPageContent, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("contact");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/contato",
    image: page.bannerImage,
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPageContent("contact"), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <ContactSection
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        mapEmbed={settings.mapEmbed}
      />
    </div>
  );
}
