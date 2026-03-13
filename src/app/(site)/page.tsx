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
  getLocationContent,
  getPageContent,
  getRestaurantContent,
  getRoomCategories,
  getSiteSettings,
  getTour360Content,
} from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody, getHeroCards } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPageContent("home");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/",
    image: page.bannerImage,
  });
}

export default async function HomePage() {
  const [settings, homePage, roomCategories, restaurant, tour, location, blogPosts, faqs] =
    await Promise.all([
      getSiteSettings(),
      getPageContent("home"),
      getRoomCategories(),
      getRestaurantContent(),
      getTour360Content(),
      getLocationContent(),
      getBlogPosts(),
      getFaqItems(),
    ]);

  const homeBody = getContentBody(homePage.content);
  const heroCards = getHeroCards(homePage.content);
  const hasHeroCards = heroCards.length > 0;
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
    <div className="space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />

      <HeroSection
        title={homePage.title}
        subtitle={homePage.subtitle ?? ""}
        image={homePage.bannerImage ?? ""}
      >
        <BookingSearchCard
          baseUrl={settings.omnibeesBaseUrl}
          hotelId={settings.omnibeesHotelId}
        />
      </HeroSection>

      <section className="mx-auto max-w-6xl">
        <div
          className={hasHeroCards
            ? "grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.42fr)] lg:items-start xl:gap-12"
            : "space-y-8"}
        >
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Hospitalidade"
              title="Uma base elegante para viver Foz do Iguacu"
              description={homeBody}
            />

            <div className="max-w-3xl">
              <div className="soft-card rounded-[1.8rem] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
                  Reserva direta
                </p>
                <h2 className="mt-4 text-4xl leading-none text-slate-950">
                  Conversao com foco em experiencia premium
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  A jornada foi desenhada para destacar a reserva direta, reduzir atritos e apresentar o hotel como uma opcao moderna e confiavel em Foz do Iguacu.
                </p>
              </div>
            </div>
          </div>

          {hasHeroCards ? (
            <HighlightCardColumn cards={heroCards} className="lg:pt-6" />
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10">
        <SectionHeading
          eyebrow="Acomodacoes"
          title="Quartos organizados por categoria"
          description="Escolha entre as categorias Standard e Superior, depois explore os detalhes de cada acomodacao em um modal elegante."
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

      <section className="mx-auto max-w-6xl space-y-10">
        <SectionHeading
          eyebrow="Experiencia"
          title="Explore o hotel e a regiao com mais contexto"
          description="Do tour virtual a localizacao estrategica, cada detalhe foi pensado para reforcar confianca antes da reserva."
        />
        <TourLocationSection
          tourTitle={tour.title}
          tourDescription={tour.description}
          locationTitle={location.title}
          locationDescription={location.description}
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
  );
}
