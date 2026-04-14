import type { ReactNode } from "react";
import { CareerApplicationForm } from "@/components/site/career-application-form";
import { PageHero } from "@/components/site/page-hero";
import { getCareerJobs, getPageContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPageContent("careers");

  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle,
    path: "/trabalhe-conosco",
    image: page.bannerImage,
  });
}

type CareerJobs = Awaited<ReturnType<typeof getCareerJobs>>;
type CareerJob = CareerJobs[number];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand/70">
      {children}
    </p>
  );
}

function OpportunityCard({ job, index }: { job: CareerJob; index: number }) {
  return (
    <article className="soft-card rounded-[1.8rem] p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand/70">
          Vaga {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Aberta
        </span>
      </div>

      <h3 className="mt-5 text-[2rem] leading-[0.95] font-semibold text-slate-950">
        {job.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-[0.95rem]">
        {job.description}
      </p>
    </article>
  );
}

export default async function CareersPage() {
  const [page, jobs] = await Promise.all([getPageContent("careers"), getCareerJobs()]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        image={page.bannerImage}
        badge="Carreiras"
      />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] xl:items-start">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.62fr)] xl:items-end">
            <div className="max-w-2xl">
              <SectionEyebrow>Vagas abertas</SectionEyebrow>
              <h2 className="mt-3 text-[2.15rem] leading-[0.94] font-semibold text-slate-950 md:text-[3rem]">
                Oportunidades para crescer com a equipe.
              </h2>
            </div>

            <p className="max-w-lg text-sm leading-7 text-slate-600 md:text-base md:leading-8 xl:justify-self-end">
              Veja as vagas publicadas abaixo e candidate-se diretamente para a oportunidade que faz
              sentido para você.
            </p>
          </div>

          {jobs.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job, index) => (
                <OpportunityCard key={job.id} job={job} index={index} />
              ))}
            </div>
          ) : (
            <article className="soft-card rounded-[1.9rem] p-7 md:p-8">
              <SectionEyebrow>Sem vagas</SectionEyebrow>
              <h3 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
                Nenhuma vaga publicada no momento
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                Quando novas oportunidades forem abertas, elas aparecerão aqui com a descrição da
                vaga e o formulário de candidatura correspondente.
              </p>
            </article>
          )}
        </div>

        {jobs.length ? (
          <CareerApplicationForm jobs={jobs.map((job) => ({ id: job.id, title: job.title }))} />
        ) : (
          <article className="soft-card rounded-[2rem] p-7 md:p-8 xl:sticky xl:top-28">
            <SectionEyebrow>Candidaturas</SectionEyebrow>
            <h3 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
              Formulário indisponível no momento
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
              O envio de currículo fica disponível assim que existir pelo menos uma vaga ativa para
              candidatura nesta página.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
