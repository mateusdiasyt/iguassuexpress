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
  getGalleryImages,
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

function resolveHomeHeroImage(value?: string | null) {
  if (!value || !value.trim()) {
    return HOME_HERO_FALLBACK;
  }

  return value.includes(OLD_HOME_HERO_TOKEN) ? HOME_HERO_FALLBACK : value;
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
  const [settings, homePage, roomCategories, restaurant, tour, galleryImages, blogPosts, faqs] =
    await Promise.all([
      getSiteSettings(),
      getPageContent("home"),
      getRoomCategories(),
      getRestaurantContent(),
      getTour360Content(),
      getGalleryImages(),
      getBlogPosts(),
      getFaqItems(),
    ]);

  const heroCards = getHeroCards(homePage.content);
  const hasHeroCards = heroCards.length > 0;
  const heroImage = resolveHomeHeroImage(homePage.bannerImage);
  const fallbackTourScenes = galleryImages.map((image, index) => ({
    id: image.id,
    title: image.category,
    description:
      image.altText ||
      `Cena ${index + 2} preparada para evoluir para um panorama oficial em 360 graus.`,
    image: image.imageUrl,
  }));
  const customTourScenes = (tour.gallery ?? []).map((image, index) => ({
    id: `tour-gallery-${index + 1}`,
    title: index === 0 ? "Piscina panoramica" : `Cena 360 ${index + 1}`,
    description:
      index === 0
        ? "Deck externo e area de descanso em uma vista ampla para inspirar a reserva."
        : `Cena imersiva ${index + 1} preparada para a experiencia panoramica do hotel.`,
    image,
  }));
  const tourScenes = [
    {
      id: "tour-pool",
      title: "Piscina panoramica",
      description: "Deck externo e area de descanso em uma vista ampla para inspirar a reserva.",
      image: tour.heroImage || heroImage,
    },
    ...(customTourScenes.length ? customTourScenes : fallbackTourScenes),
  ]
    .filter(
      (scene, index, allScenes) =>
        Boolean(scene.image) &&
        allScenes.findIndex((item) => item.image === scene.image) === index,
    )
    .slice(0, 4);
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
          />
        </div>

        <section className="mx-auto max-w-6xl">
          <TourLocationSection
            tourTitle={tour.title}
            tourDescription={tour.description}
            previewImage={tour.heroImage || heroImage}
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
            email={settings.email}
            address={settings.address}
            mapEmbed={settings.mapEmbed}
          />
        </div>
      </div>
    </>
  );
}
