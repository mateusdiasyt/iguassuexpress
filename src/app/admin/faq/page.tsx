import { MessageCircleQuestion, Plus } from "lucide-react";
import { deleteFaqAction, saveFaqAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
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

function InlineVisibilityToggle({
  defaultChecked = true,
}: {
  defaultChecked?: boolean;
}) {
  return (
    <label
      aria-label="Exibir no FAQ da home"
      title="Exibir no FAQ da home"
      className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center"
    >
      <input type="checkbox" name="isActive" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]"
      />
    </label>
  );
}

export default async function AdminFaqPage() {
  const session = await requireAdmin();
  const faqs = await getFaqItems(true);

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

          <form action={saveFaqAction} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_8rem]">
            <div className="grid gap-4 lg:col-span-2">
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

            <div className="grid gap-4 lg:col-span-2 lg:grid-cols-[8rem_auto] lg:items-end">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Ordem</span>
                <Input name="order" type="number" defaultValue="0" />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <InlineVisibilityToggle defaultChecked />
                  <span className="text-sm text-slate-600">Item ativo</span>
                </div>
                <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                  Adicionar
                </SubmitButton>
              </div>
            </div>
          </form>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          {faqs.map((faq, index) => {
            const deleteFormId = `delete-faq-${faq.id}`;

            return (
              <article
                key={faq.id}
                className="rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm"
              >
                <form action={saveFaqAction} className="space-y-4">
                  <input type="hidden" name="id" value={faq.id} />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <MessageCircleQuestion className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <SectionEyebrow>FAQ {String(index + 1).padStart(2, "0")}</SectionEyebrow>
                        <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {faq.question}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Ordem {faq.order}
                      </span>
                      <InlineVisibilityToggle defaultChecked={faq.isActive} />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <label className="grid gap-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-950">Pergunta</span>
                      <Input name="question" defaultValue={faq.question} />
                    </label>

                    <label className="grid gap-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-950">Resposta</span>
                      <Textarea name="answer" className="min-h-[140px]" defaultValue={faq.answer} />
                    </label>

                    <label className="grid max-w-[8rem] gap-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-950">Ordem</span>
                      <Input name="order" type="number" defaultValue={faq.order} />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      {faq.isActive ? "Visivel na home" : "Oculto na home"}
                    </span>

                    <div className="flex flex-wrap items-center gap-3">
                      <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                        Salvar
                      </SubmitButton>
                      <Button
                        type="submit"
                        form={deleteFormId}
                        variant="outline"
                        className="h-10 px-4 border-slate-200 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </form>

                <form id={deleteFormId} action={deleteFaqAction}>
                  <input type="hidden" name="id" value={faq.id} />
                </form>
              </article>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
