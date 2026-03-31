import { Plus } from "lucide-react";
import { saveFaqAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { FaqWorkspace } from "@/components/admin/faq/faq-workspace";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getFaqItems } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ Admin",
  description: "Gerencie perguntas frequentes exibidas na home.",
  path: "/admin/faq",
  noIndex: true,
});

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

export default async function AdminFaqPage() {
  const session = await requireAdmin();
  const faqs = await getFaqItems(true);
  const nextFaqOrder = faqs.length ? Math.max(...faqs.map((faq) => faq.order)) + 1 : 0;
  const faqWorkspaceKey = faqs
    .map((faq) => `${faq.id}:${faq.order}:${faq.question}:${faq.answer}:${faq.isActive ? 1 : 0}`)
    .join("|");

  return (
    <AdminShell
      title="FAQ"
      description="Crie, ordene e ative ou desative perguntas frequentes."
      pathname="/admin/faq"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>FAQ da home</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Perguntas frequentes
            </h1>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            {faqs.length} {faqs.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <details className="group rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50/80 [&::-webkit-details-marker]:hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
              <Plus className="h-4 w-4 transition group-open:rotate-45" />
            </span>
            <span>Adicionar pergunta</span>
          </summary>

          <form action={saveFaqAction} className="mt-4 grid gap-4 px-1 pb-1">
            <input type="hidden" name="order" value={nextFaqOrder} />
            <input type="hidden" name="isActive" value="true" />

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Pergunta</span>
                <Input name="question" placeholder="Ex.: O cafe da manha esta incluso?" />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Resposta</span>
                <Textarea
                  name="answer"
                  className="min-h-[132px]"
                  placeholder="Escreva uma resposta clara e objetiva para o visitante."
                />
              </label>
            </div>

            <div className="flex justify-end rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
              <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                Adicionar
              </SubmitButton>
            </div>
          </form>
        </details>

        <FaqWorkspace key={faqWorkspaceKey} items={faqs} />
      </section>
    </AdminShell>
  );
}
