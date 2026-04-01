import { BlogCard } from "@/components/site/blog-card";
import { BookingSearchCard } from "@/components/site/booking-search-card";
import { ContactSection } from "@/components/site/contact-section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { HeroSection } from "@/components/site/hero-section";
import { HighlightCardColumn } from "@/components/site/highlight-card-column";
import { RestaurantHighlight } from "@/components/site/restaurant-highlight";
import { RoomCatalog } from "@/components/site/room-catalog";
import { TourLocationSection } from "@/components/site/tour-location-section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getBlogPosts,
  getFaqItems,
  getMenuCategories,
  getPageContent,
  getRestaurantContent,
  getRoomCategories,
  getSiteSettings,
  getTour360Content,
} from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getHeroCards } from "@/lib/utils";

const HOME_HERO_FALLBACK = "/piscina-hotel-iguassu.jpg";
const OLD_HOME_HERO_TOKEN = "photo-1566073771259-6a8506099945";
const OLD_TOUR_DESCRIPTION_TOKEN = "Publique aqui o tour virtual oficial do hotel";

function resolveHomeHeroImage(value?: string | null) {
  if (!value || !value.trim()) {
    return HOME_HERO_FALLBACK;
  }

  return value.includes(OLD_HOME_HERO_TOKEN) ? HOME_HERO_FALLBACK : value;
}

function resolveTourDescription(value?: string | null) {
  if (!value || !value.trim() || value.includes(OLD_TOUR_DESCRIPTION_TOKEN)) {
    return "Gire as fotos panoramicas do hotel para olhar os ambientes em 360 e antecipar a atmosfera da sua hospedagem.";
  }

  return value;
}

export async function generateMetadata() {
  const page = await getPageContent("home");
  const heroImage = resolveHomeHeroImage(page.bannerImage);

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/",
    image: heroImage,
  });
}

export default async function HomePage() {
  const [settings, homePage, roomCategories, restaurant, menuCategories, tour, blogPosts, faqs] =
    await Promise.all([
      getSiteSettings(),
      getPageContent("home"),
      getRoomCategories(),
      getRestaurantContent(),
      getMenuCategories(),
      getTour360Content(),
      getBlogPosts(),
      getFaqItems(),
    ]);

  const heroCards = getHeroCards(homePage.content);
  const hasHeroCards = heroCards.length > 0;
  const heroImage = resolveHomeHeroImage(homePage.bannerImage);
  const totalMenuItems = menuCategories.reduce(
    (total, category) =>
      total + category.items.length + category.children.reduce((childTotal, child) => childTotal + child.items.length, 0),
    0,
  );
  const tourDescription = resolveTourDescription(tour.description);
  const tourScenes = (tour.scenes ?? []).slice(0, 6);
  const primaryTourImage = tourScenes[0]?.image || tour.heroImage || heroImage;
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: settings.hotelName,
    address: settings.address,
    telephone: settings.phone,
    email: settings.email,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />

      <div className="space-y-24">
        <HeroSection
          title={homePage.title}
          subtitle={homePage.subtitle ?? ""}
          image={heroImage}
        >
          <BookingSearchCard
            baseUrl={settings.omnibeesBaseUrl}
            hotelId={settings.omnibeesHotelId}
          />
        </HeroSection>

        {hasHeroCards ? (
          <section className="mx-auto -mt-10 max-w-6xl lg:-mt-16">
            <HighlightCardColumn cards={heroCards} mapEmbed={settings.mapEmbed} />
          </section>
        ) : null}

        <section className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Acomodacoes"
            title="Quartos organizados por categoria"
            description="Escolha entre as categorias Standard e Superior, depois explore os detalhes de cada acomodacao em um modal elegante."
            layout="split"
          />
          <RoomCatalog categories={roomCategories} />
        </section>

        <div className="mx-auto max-w-6xl">
          <RestaurantHighlight
            title={restaurant.teaserTitle ?? "Sabores para a sua estada"}
            description={
              restaurant.teaserDescription ??
              "Cafe da manha, opcao a la carte e um ambiente acolhedor para completar a hospedagem."
            }
            image={restaurant.heroImage}
            categoryCount={menuCategories.length}
            itemCount={totalMenuItems}
          />
        </div>

        <section className="mx-auto max-w-6xl">
          <TourLocationSection
            tourTitle={tour.title}
            tourDescription={tourDescription}
            previewImage={primaryTourImage}
            scenes={tourScenes}
          />
        </section>

        <section className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Blog"
            title="Conteudo editorial para inspirar a viagem"
            description="Guias, dicas e pautas de Foz do Iguacu para alimentar o SEO local e ajudar o visitante a planejar a estada."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas frequentes"
            description="Informacoes essenciais para acelerar a decisao de reserva e reduzir duvidas no primeiro contato."
          />
          <FaqAccordion items={faqs} />
        </section>

        <div className="mx-auto max-w-6xl">
          <ContactSection
            whatsapp={settings.whatsapp}
            phone={settings.phone}
            mapEmbed={settings.mapEmbed}
          />
        </div>
      </div>
    </>
  );
}
