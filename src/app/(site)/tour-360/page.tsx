import { PageHero } from "@/components/site/page-hero";
import { Tour360Showcase } from "@/components/site/tour-360-showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPageContent, getTour360Content } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";

const OLD_TOUR_DESCRIPTION_TOKEN = "Publique aqui o tour virtual oficial do hotel";

function resolveTourDescription(value?: string | null) {
  if (!value || !value.trim() || value.includes(OLD_TOUR_DESCRIPTION_TOKEN)) {
    return "Gire as fotos panoramicas do hotel para olhar os ambientes em 360 e sentir a atmosfera de cada espaco antes da reserva.";
  }

  return value;
}

export async function generateMetadata() {
  const page = await getPageContent("tour-360");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/tour-360",
    image: page.bannerImage,
  });
}

export default async function Tour360Page() {
  const [page, tour] = await Promise.all([getPageContent("tour-360"), getTour360Content()]);
  const tourDescription = resolveTourDescription(tour.description);
  const tourScenes = Array.from(
    new Set(
      [...(tour.gallery ?? []), tour.heroImage, page.bannerImage].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ).map((image, index) => ({
    id: `tour-scene-${index + 1}`,
    title: index === 0 ? "Panorama principal" : `Ambiente 360 ${index + 1}`,
    description:
      index === 0
        ? tourDescription
        : `Cena panoramica ${index + 1} publicada para apresentar o hotel com uma leitura mais imersiva.`,
    image,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} />

      <section className="soft-card rounded-[1.8rem] p-8 md:p-10">
        <SectionHeading
          eyebrow="Street View do hotel"
          title="Olhe para os lados em 360 e sinta a atmosfera de cada ambiente."
          description="Agora o tour usa fotos panoramicas reais: voce arrasta a cena, gira o ponto de vista e explora o hotel sem sair do mesmo lugar."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.45rem] border border-brand/10 bg-white/70 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
              Movimento
            </p>
            <h3 className="mt-3 text-xl leading-tight font-bold text-slate-950">
              Rotacao livre na mesma cena
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              O visitante gira o panorama com o mouse ou com o toque, sem mudar de ambiente.
            </p>
          </article>

          <article className="rounded-[1.45rem] border border-brand/10 bg-white/70 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
              Leitura
            </p>
            <h3 className="mt-3 text-xl leading-tight font-bold text-slate-950">
              Mais proximo do Street View
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A experiencia foi pensada para olhar em volta, com foco total na percepcao do espaco.
            </p>
          </article>

          <article className="rounded-[1.45rem] border border-brand/10 bg-white/70 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
              Cenas
            </p>
            <h3 className="mt-3 text-xl leading-tight font-bold text-slate-950">
              {tourScenes.length} ambientes publicados
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Cada foto cadastrada no painel vira uma cena panoramica pronta para ser explorada.
            </p>
          </article>
        </div>
      </section>

      {tourScenes.length ? (
        <Tour360Showcase title={tour.title} description={tourDescription} scenes={tourScenes} />
      ) : (
        <section className="soft-card rounded-[1.8rem] p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
            Tour 360
          </p>
          <h2 className="mt-4 text-4xl leading-none text-slate-950">
            Nenhuma cena panoramica foi publicada ainda
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Assim que as fotos 360 forem cadastradas no painel, esta pagina passa a mostrar a navegacao panoramica completa.
          </p>
        </section>
      )}
    </div>
  );
}
