import { PageHero } from "@/components/site/page-hero";
import { RoomCatalog } from "@/components/site/room-catalog";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPageContent, getRoomCategories } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("apartments");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/apartamentos",
    image: page.bannerImage,
  });
}

export default async function ApartmentsPage() {
  const [page, roomCategories] = await Promise.all([
    getPageContent("apartments"),
    getRoomCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Categorias"
          title="Standard e Superior com navegação intuitiva"
          description="Selecione a categoria desejada e descubra os detalhes completos de cada acomodacao em uma experiencia visual premium."
        />
        <RoomCatalog categories={roomCategories} />
      </section>
    </div>
  );
}
