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

        <section className="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Plus className="h-4.5 w-4.5" />
            </span>
            <div>
              <SectionEyebrow>Novo item</SectionEyebrow>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Adicionar pergunta
              </h2>
            </div>
          </div>

          <form action={saveFaqAction} className="mt-5 grid gap-4">
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

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm text-slate-500">
                O novo item entra no fim da lista e depois pode ser arrastado.
              </span>

              <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                Adicionar
              </SubmitButton>
            </div>
          </form>
        </section>

        <FaqWorkspace key={faqWorkspaceKey} items={faqs} />
      </section>
    </AdminShell>
  );
}
