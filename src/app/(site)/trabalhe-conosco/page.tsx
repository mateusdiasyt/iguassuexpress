import { CareerApplicationForm } from "@/components/site/career-application-form";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
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

export default async function CareersPage() {
  const [page, jobs] = await Promise.all([getPageContent("careers"), getCareerJobs()]);

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.bannerImage} badge="Carreiras" />
      <section className="soft-card rounded-[1.8rem] p-8">
        <RichText content={getContentBody(page.content)} />
      </section>
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Vagas ativas"
            title="Oportunidades abertas"
            description="Mantenha esta lista atualizada pelo painel administrativo para comunicar vagas reais e fortalecer a marca empregadora do hotel."
          />
          <div className="grid gap-4">
            {jobs.map((job) => (
              <article key={job.id} className="soft-card rounded-[1.7rem] p-6">
                <h3 className="text-3xl leading-none text-slate-950">{job.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{job.description}</p>
              </article>
            ))}
          </div>
        </div>
        <CareerApplicationForm jobs={jobs.map((job) => ({ id: job.id, title: job.title }))} />
      </section>
    </div>
  );
}
