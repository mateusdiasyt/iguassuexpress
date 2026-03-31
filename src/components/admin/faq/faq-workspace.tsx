"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { GripVertical, LoaderCircle, MessageCircleQuestion } from "lucide-react";
import { deleteFaqAction, reorderFaqItemsAction, saveFaqAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
};

type FaqWorkspaceProps = {
  items: FaqItem[];
};

type OrderState = "idle" | "saving" | "saved" | "error";

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

function moveItem(items: FaqItem[], draggedId: string, targetId: string) {
  const fromIndex = items.findIndex((item) => item.id === draggedId);
  const toIndex = items.findIndex((item) => item.id === targetId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [moved] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, moved);
  return nextItems;
}

export function FaqWorkspace({ items }: FaqWorkspaceProps) {
  const [faqs, setFaqs] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<OrderState>("idle");
  const originalOrderRef = useRef<string[]>([]);
  const latestFaqsRef = useRef(items);

  useEffect(() => {
    latestFaqsRef.current = faqs;
  }, [faqs]);

  useEffect(() => {
    if (orderState !== "saved") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setOrderState("idle");
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [orderState]);

  const visibleOrder = useMemo(
    () =>
      faqs.reduce<Record<string, number>>((accumulator, item, index) => {
        accumulator[item.id] = index + 1;
        return accumulator;
      }, {}),
    [faqs],
  );

  async function persistOrder(nextItems: FaqItem[]) {
    const formData = new FormData();

    nextItems.forEach((item) => {
      formData.append("ids", item.id);
    });

    setOrderState("saving");

    try {
      await reorderFaqItemsAction(formData);
      setOrderState("saved");
    } catch (error) {
      console.error("Falha ao reordenar FAQ.", error);

      const fallbackOrder = originalOrderRef.current;
      if (fallbackOrder.length) {
        const orderMap = new Map(fallbackOrder.map((id, index) => [id, index]));
        setFaqs((current) =>
          [...current].sort((left, right) => {
            return (orderMap.get(left.id) ?? 0) - (orderMap.get(right.id) ?? 0);
          }),
        );
      }

      setOrderState("error");
    }
  }

  function handleDragStart(id: string) {
    originalOrderRef.current = faqs.map((item) => item.id);
    setDraggedId(id);
    setOrderState("idle");
  }

  function handleDragOver(event: DragEvent<HTMLElement>, targetId: string) {
    event.preventDefault();

    if (!draggedId || draggedId === targetId) {
      return;
    }

    setFaqs((current) => moveItem(current, draggedId, targetId));
  }

  function handleDragEnd() {
    if (!draggedId) {
      return;
    }

    const nextItems = latestFaqsRef.current;
    const nextOrder = nextItems.map((item) => item.id);
    const previousOrder = originalOrderRef.current;

    setDraggedId(null);

    if (
      nextOrder.length === previousOrder.length &&
      nextOrder.every((id, index) => id === previousOrder[index])
    ) {
      return;
    }

    void persistOrder(nextItems);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
        <span className="text-sm text-slate-500">
          Arraste os cards para reorganizar a ordem de exibicao na home.
        </span>

        <p aria-live="polite" className="inline-flex min-h-5 items-center gap-2 text-sm text-slate-500">
          {orderState === "saving" ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
              Salvando ordem...
            </>
          ) : null}
          {orderState === "saved" ? "Ordem salva" : null}
          {orderState === "error" ? "Falha ao salvar a ordem" : null}
        </p>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq, index) => {
          const deleteFormId = `delete-faq-${faq.id}`;

          return (
            <article
              key={faq.id}
              onDragOver={(event) => handleDragOver(event, faq.id)}
              onDrop={(event) => event.preventDefault()}
              className={[
                "rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm transition",
                draggedId === faq.id ? "opacity-70" : "",
              ].join(" ")}
            >
              <form action={saveFaqAction} className="space-y-4">
                <input type="hidden" name="id" value={faq.id} />
                <input type="hidden" name="order" value={index} readOnly />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      draggable
                      onDragStart={() => handleDragStart(faq.id)}
                      onDragEnd={handleDragEnd}
                      className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 active:cursor-grabbing"
                      aria-label={`Arrastar ${faq.question}`}
                      title="Arrastar para reordenar"
                    >
                      <GripVertical className="h-4.5 w-4.5" />
                    </button>

                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <MessageCircleQuestion className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <SectionEyebrow>FAQ {String(visibleOrder[faq.id] ?? index + 1).padStart(2, "0")}</SectionEyebrow>
                        <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {faq.question}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Posicao {visibleOrder[faq.id] ?? index + 1}
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
    </div>
  );
}
