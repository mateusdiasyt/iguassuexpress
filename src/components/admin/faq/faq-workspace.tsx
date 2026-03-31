"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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

type DragSession = {
  draggedId: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

type DragDocumentStyles = {
  bodyUserSelect: string;
  bodyUserSelectPriority: string;
  bodyCursor: string;
  bodyCursorPriority: string;
  htmlCursor: string;
  htmlCursorPriority: string;
};

type DragHoverState = {
  targetId: string | null;
  placeAfter: boolean;
};

type DragPointerPosition = {
  clientX: number;
  clientY: number;
};

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

function moveItem(items: FaqItem[], draggedId: string, targetId: string, placeAfter = false) {
  const fromIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (fromIndex === -1 || targetIndex === -1) {
    return items;
  }

  let toIndex = targetIndex + (placeAfter ? 1 : 0);
  if (fromIndex < toIndex) {
    toIndex -= 1;
  }

  if (fromIndex === toIndex) {
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
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<OrderState>("idle");
  const originalOrderRef = useRef<string[]>([]);
  const latestFaqsRef = useRef(items);
  const dragPreviewRef = useRef<HTMLElement | null>(null);
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const dragSessionRef = useRef<DragSession | null>(null);
  const dragDocumentStylesRef = useRef<DragDocumentStyles | null>(null);
  const dragHoverStateRef = useRef<DragHoverState>({ targetId: null, placeAfter: false });
  const dragPointerPositionRef = useRef<DragPointerPosition | null>(null);
  const dragFrameRef = useRef<number | null>(null);

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

  function applyDragDocumentStyles() {
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;

    dragDocumentStylesRef.current = {
      bodyUserSelect: bodyStyle.getPropertyValue("user-select"),
      bodyUserSelectPriority: bodyStyle.getPropertyPriority("user-select"),
      bodyCursor: bodyStyle.getPropertyValue("cursor"),
      bodyCursorPriority: bodyStyle.getPropertyPriority("cursor"),
      htmlCursor: htmlStyle.getPropertyValue("cursor"),
      htmlCursorPriority: htmlStyle.getPropertyPriority("cursor"),
    };

    bodyStyle.setProperty("user-select", "none", "important");
    bodyStyle.setProperty("cursor", "grabbing", "important");
    htmlStyle.setProperty("cursor", "grabbing", "important");
  }

  function restoreDragDocumentStyles() {
    if (!dragDocumentStylesRef.current) {
      return;
    }

    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const snapshot = dragDocumentStylesRef.current;

    if (snapshot.bodyUserSelect) {
      bodyStyle.setProperty("user-select", snapshot.bodyUserSelect, snapshot.bodyUserSelectPriority);
    } else {
      bodyStyle.removeProperty("user-select");
    }

    if (snapshot.bodyCursor) {
      bodyStyle.setProperty("cursor", snapshot.bodyCursor, snapshot.bodyCursorPriority);
    } else {
      bodyStyle.removeProperty("cursor");
    }

    if (snapshot.htmlCursor) {
      htmlStyle.setProperty("cursor", snapshot.htmlCursor, snapshot.htmlCursorPriority);
    } else {
      htmlStyle.removeProperty("cursor");
    }

    dragDocumentStylesRef.current = null;
  }

  function updateDragPreviewPosition(clientX: number, clientY: number) {
    const preview = dragPreviewRef.current;
    const session = dragSessionRef.current;

    if (!preview || !session) {
      return;
    }

    const left = clientX - session.offsetX;
    const top = clientY - session.offsetY;
    preview.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(-1.8deg) scale(0.98)`;
  }

  function scheduleDragFrame() {
    if (dragFrameRef.current !== null) {
      return;
    }

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;

      const session = dragSessionRef.current;
      const pointer = dragPointerPositionRef.current;
      if (!session || !pointer) {
        return;
      }

      updateDragPreviewPosition(pointer.clientX, pointer.clientY);

      const hoveredElement = document.elementFromPoint(pointer.clientX, pointer.clientY);
      const targetCard =
        hoveredElement instanceof HTMLElement
          ? hoveredElement.closest<HTMLElement>("[data-faq-card-id]")
          : null;
      const targetId = targetCard?.dataset.faqCardId ?? null;

      if (!targetCard || !targetId || targetId === session.draggedId) {
        dragHoverStateRef.current = { targetId: session.draggedId, placeAfter: false };
        setDragOverId((current) => (current === session.draggedId ? current : session.draggedId));
        return;
      }

      const targetRect = targetCard.getBoundingClientRect();
      const placeAfter = pointer.clientY > targetRect.top + targetRect.height / 2;
      const hoverState = dragHoverStateRef.current;

      if (hoverState.targetId === targetId && hoverState.placeAfter === placeAfter) {
        setDragOverId((current) => (current === targetId ? current : targetId));
        return;
      }

      dragHoverStateRef.current = { targetId, placeAfter };
      setDragOverId(targetId);
      setFaqs((current) => {
        const nextItems = moveItem(current, session.draggedId, targetId, placeAfter);

        if (nextItems === current) {
          return current;
        }

        latestFaqsRef.current = nextItems;
        return nextItems;
      });
    });
  }

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
        setFaqs((current) => {
          const revertedItems = [...current].sort((left, right) => {
            return (orderMap.get(left.id) ?? 0) - (orderMap.get(right.id) ?? 0);
          });

          latestFaqsRef.current = revertedItems;
          return revertedItems;
        });
      }

      setOrderState("error");
    }
  }

  async function finishDrag() {
    if (dragFrameRef.current !== null) {
      window.cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }

    const session = dragSessionRef.current;
    if (session && dragHandleRef.current?.hasPointerCapture(session.pointerId)) {
      dragHandleRef.current.releasePointerCapture(session.pointerId);
    }

    dragHandleRef.current = null;
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
    restoreDragDocumentStyles();

    dragSessionRef.current = null;
    dragPointerPositionRef.current = null;
    dragHoverStateRef.current = { targetId: null, placeAfter: false };

    if (!session) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const nextItems = latestFaqsRef.current;
    const nextOrder = nextItems.map((item) => item.id);
    const previousOrder = originalOrderRef.current;

    setDraggedId(null);
    setDragOverId(null);

    if (
      nextOrder.length === previousOrder.length &&
      nextOrder.every((id, index) => id === previousOrder[index])
    ) {
      return;
    }

    await persistOrder(nextItems);
  }

  useEffect(() => {
    return () => {
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }

      dragPreviewRef.current?.remove();
      dragPreviewRef.current = null;
      restoreDragDocumentStyles();
      dragSessionRef.current = null;
      dragPointerPositionRef.current = null;
      dragHoverStateRef.current = { targetId: null, placeAfter: false };
    };
  }, []);

  function handlePointerDown(id: string) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      const card = event.currentTarget.closest("article");
      if (!(card instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();

      const rect = card.getBoundingClientRect();
      const preview = card.cloneNode(true) as HTMLElement;
      preview.setAttribute("aria-hidden", "true");
      preview.style.position = "fixed";
      preview.style.top = "0";
      preview.style.left = "0";
      preview.style.width = `${rect.width}px`;
      preview.style.maxWidth = `${rect.width}px`;
      preview.style.pointerEvents = "none";
      preview.style.transition = "none";
      preview.style.opacity = "0.98";
      preview.style.boxShadow = "0 18px 40px rgba(15,23,42,0.14)";
      preview.style.backdropFilter = "none";
      preview.style.setProperty("-webkit-backdrop-filter", "none");
      preview.style.contain = "layout paint style";
      preview.style.zIndex = "2147483647";
      preview.style.willChange = "transform";
      document.body.appendChild(preview);

      dragPreviewRef.current?.remove();
      dragPreviewRef.current = preview;
      dragHandleRef.current = event.currentTarget;
      dragSessionRef.current = {
        draggedId: id,
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      dragPointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
      dragHoverStateRef.current = { targetId: id, placeAfter: false };

      event.currentTarget.setPointerCapture(event.pointerId);
      updateDragPreviewPosition(event.clientX, event.clientY);
      applyDragDocumentStyles();

      originalOrderRef.current = latestFaqsRef.current.map((item) => item.id);
      setDraggedId(id);
      setDragOverId(id);
      setOrderState("idle");
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    event.preventDefault();
    dragPointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
    scheduleDragFrame();
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    event.preventDefault();
    void finishDrag();
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
              data-faq-card-id={faq.id}
              className={[
                "rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-200",
                draggedId === faq.id
                  ? "scale-[0.985] border-dashed border-slate-300 bg-slate-50/80 opacity-60 shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                  : "",
                dragOverId === faq.id && draggedId !== faq.id
                  ? "border-slate-300 bg-slate-50/70 shadow-[0_24px_56px_rgba(15,23,42,0.12)]"
                  : "",
              ].join(" ")}
            >
              <form action={saveFaqAction} className="space-y-4">
                <input type="hidden" name="id" value={faq.id} />
                <input type="hidden" name="order" value={index} readOnly />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onPointerDown={handlePointerDown(faq.id)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      className="flex h-10 w-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 active:cursor-grabbing"
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
