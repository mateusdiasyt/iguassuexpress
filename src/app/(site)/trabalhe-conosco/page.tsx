import type { ReactNode } from "react";
import { BriefcaseBusiness, HeartHandshake, Sparkles } from "lucide-react";
import { CareerApplicationForm } from "@/components/site/career-application-form";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { getCareerJobs, getPageContent } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { getContentBody } from "@/lib/utils";

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

function InsightCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  description: string;
}) {
  return (
    <article className="soft-card rounded-[1.55rem] p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
        <article className="soft-card rounded-[2rem] p-6 md:p-8 lg:p-10">
          <SectionEyebrow>Trabalhe conosco</SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-[2.2rem] leading-[0.94] font-semibold text-slate-950 md:text-[3.2rem]">
            Hospitalidade feita por pessoas que gostam de cuidar bem.
          </h2>

          <div className="mt-6 max-w-3xl">
            <RichText content={getContentBody(page.content)} />
          </div>
        </article>

        <div className="grid gap-4">
          <InsightCard
            icon={BriefcaseBusiness}
            title={`${jobs.length} ${jobs.length === 1 ? "vaga ativa" : "vagas ativas"}`}
            description="As oportunidades abertas sao atualizadas direto pelo painel administrativo do hotel."
          />
          <InsightCard
            icon={HeartHandshake}
            title="Banco de talentos sempre aberto"
            description="Mesmo sem encontrar a vaga ideal agora, voce pode enviar seu curriculo e entrar no nosso radar."
          />
          <InsightCard
            icon={Sparkles}
            title="Processo simples e direto"
            description="Escolha uma vaga, apresente sua experiencia e envie o curriculo em poucos minutos."
          />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] xl:items-start">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(240px,0.6fr)] lg:items-end">
            <div>
              <SectionEyebrow>Vagas abertas</SectionEyebrow>
              <h2 className="mt-3 text-[2.15rem] leading-[0.94] font-semibold text-slate-950 md:text-[3rem]">
                Oportunidades para crescer com a equipe.
              </h2>
            </div>

            <p className="max-w-lg text-sm leading-7 text-slate-600 md:text-base md:leading-8">
              Candidate-se para uma vaga especifica ou use o formulario ao lado para entrar no banco
              de talentos do hotel.
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
              <SectionEyebrow>Banco de talentos</SectionEyebrow>
              <h3 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
                Nenhuma vaga publicada no momento
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                Ainda assim, voce pode enviar seu curriculo para o nosso banco de talentos. Assim que uma
                oportunidade fizer sentido para o seu perfil, a equipe podera retomar o contato.
              </p>
            </article>
          )}
        </div>

        <CareerApplicationForm jobs={jobs.map((job) => ({ id: job.id, title: job.title }))} />
      </section>
    </div>
  );
}
