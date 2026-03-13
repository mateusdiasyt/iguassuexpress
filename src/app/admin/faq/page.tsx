import { deleteFaqAction, saveFaqAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
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

export default async function AdminFaqPage() {
  const session = await requireAdmin();
  const faqs = await getFaqItems();

  return (
    <AdminShell
      title="FAQ"
      description="Crie, ordene e ative ou desative perguntas frequentes."
      pathname="/admin/faq"
      userName={session.user.name}
    >
      <AdminCard title="Nova pergunta">
        <form action={saveFaqAction} className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-600">
            Pergunta
            <Input name="question" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Resposta
            <Textarea name="answer" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Ordem
              <Input name="order" type="number" defaultValue="0" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" name="isActive" defaultChecked />
              Item ativo
            </label>
          </div>
          <div>
            <SubmitButton>Adicionar FAQ</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid gap-6">
        {faqs.map((faq) => (
          <AdminCard key={faq.id} title={faq.question}>
            <form action={saveFaqAction} className="grid gap-4">
              <input type="hidden" name="id" value={faq.id} />
              <label className="grid gap-2 text-sm text-slate-600">
                Pergunta
                <Input name="question" defaultValue={faq.question} />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Resposta
                <Textarea name="answer" defaultValue={faq.answer} />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Ordem
                  <Input name="order" type="number" defaultValue={faq.order} />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <input type="checkbox" name="isActive" defaultChecked={faq.isActive} />
                  Item ativo
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <SubmitButton>Salvar FAQ</SubmitButton>
              </div>
            </form>
            <form action={deleteFaqAction} className="mt-4">
              <input type="hidden" name="id" value={faq.id} />
              <button type="submit" className="text-sm font-semibold text-red-500">
                Excluir FAQ
              </button>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
