"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, Gem, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

type HighlightCardColumnProps = {
  cards: Array<{
    title: string;
    description: string;
  }>;
  mapEmbed?: string | null;
  className?: string;
};

const WHATSAPP_MESSAGES = [
  {
    id: "guest-1",
    side: "left" as const,
    text: "Ola! Gostaria de reservar para 2 adultos.",
  },
  {
    id: "hotel-1",
    side: "right" as const,
    text: "Perfeito. Posso enviar a melhor tarifa direto pelo motor oficial.",
  },
  {
    id: "guest-2",
    side: "left" as const,
    text: "Maravilha, pode me passar o link?",
  },
  {
    id: "hotel-2",
    side: "right" as const,
    text: "Claro. Ja vou enviar o link com disponibilidade em tempo real.",
  },
  {
    id: "guest-3",
    side: "left" as const,
    text: "Excelente, obrigado!",
  },
];

const CARD_THEMES = [
  {
    surface:
      "bg-[linear-gradient(145deg,rgba(54,96,132,0.74),rgba(32,66,95,0.62))]",
    border: "border-sky-200/28",
    glow: "from-sky-300/30 via-cyan-200/12 to-transparent",
    icon: "text-sky-100",
    divider: "via-sky-200/55",
  },
  {
    surface:
      "bg-[linear-gradient(145deg,rgba(63,110,146,0.74),rgba(35,73,104,0.62))]",
    border: "border-cyan-200/26",
    glow: "from-cyan-200/30 via-teal-200/14 to-transparent",
    icon: "text-cyan-100",
    divider: "via-cyan-200/55",
  },
  {
    surface:
      "bg-[linear-gradient(145deg,rgba(69,114,150,0.74),rgba(39,74,104,0.62))]",
    border: "border-indigo-200/25",
    glow: "from-indigo-200/28 via-sky-100/12 to-transparent",
    icon: "text-indigo-100",
    divider: "via-indigo-200/55",
  },
] as const;

export function HighlightCardColumn({
  cards,
  mapEmbed,
  className,
}: HighlightCardColumnProps) {
  const icons = [MapPinned, CalendarCheck2, Gem];
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const [chatStep, setChatStep] = useState(1);
  const closePreviewTimerRef = useRef<number | null>(null);

  const isReservationPreviewActive = activePreviewIndex === 1;
  const isPremiumPreviewActive = activePreviewIndex === 2;

  function clearCloseTimer() {
    if (closePreviewTimerRef.current) {
      window.clearTimeout(closePreviewTimerRef.current);
      closePreviewTimerRef.current = null;
    }
  }

  function openPreview(index: number) {
    clearCloseTimer();
    setActivePreviewIndex(index);
  }

  function scheduleClosePreview(index: number) {
    clearCloseTimer();
    closePreviewTimerRef.current = window.setTimeout(() => {
      setActivePreviewIndex((current) => (current === index ? null : current));
    }, 120);
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!isReservationPreviewActive) {
      setChatStep(1);
      return;
    }

    const messageLength = WHATSAPP_MESSAGES.length;
    const sequence = [1, 2, 3, 4, messageLength, messageLength, messageLength];
    let pointer = 0;
    setChatStep(sequence[0]);

    const timer = window.setInterval(() => {
      pointer = (pointer + 1) % sequence.length;
      setChatStep(sequence[pointer]);
    }, 1100);

    return () => window.clearInterval(timer);
  }, [isReservationPreviewActive]);

  const visibleMessages = WHATSAPP_MESSAGES.slice(0, chatStep);
  const hiddenCount = Math.max(0, visibleMessages.length - 3);
  const chatOffset = hiddenCount * 78;

  if (!cards.length) {
    return null;
  }

  return (
    <aside className={cn("grid gap-4 md:grid-cols-3 lg:gap-5", className)}>
      {cards.map((card, index) => {
        const Icon = icons[index] ?? Gem;
        const theme = CARD_THEMES[index] ?? CARD_THEMES[0];
        const isPreviewOpen = activePreviewIndex === index;
        const previewClassName = cn(
          "absolute left-1/2 bottom-[calc(100%+0.9rem)] z-40 hidden -translate-x-1/2 transition-all duration-300 ease-out lg:block",
          isPreviewOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
          index === 2 ? "w-[24rem]" : "w-[22rem]",
        );

        return (
          <article
            key={card.title}
            className="group relative rounded-[1.8rem]"
            onMouseEnter={() => openPreview(index)}
            onMouseLeave={() => scheduleClosePreview(index)}
          >
            <div
              className={cn(
                "relative min-h-[164px] overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_18px_44px_rgba(2,16,30,0.26)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_62px_rgba(2,16,30,0.36)] md:min-h-[172px] md:p-7",
                theme.surface,
                theme.border,
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
                  theme.divider,
                )}
              />
              <div
                className={cn(
                  "absolute -top-14 -right-8 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-300 group-hover:scale-110",
                  theme.glow,
                )}
              />
              <div className="grid min-h-[116px] place-items-center md:min-h-[126px]">
                <div className="flex items-center gap-4 text-left md:gap-5">
                  <Icon className={cn("h-8 w-8 flex-none md:h-9 md:w-9", theme.icon)} />
                  <h3 className="max-w-[12rem] text-[1.45rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-white md:text-[1.62rem]">
                    {card.title}
                  </h3>
                </div>
              </div>
            </div>

            {index === 0 ? (
              <div
                className={previewClassName}
                onMouseEnter={() => openPreview(index)}
                onMouseLeave={() => scheduleClosePreview(index)}
              >
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/20 bg-[linear-gradient(140deg,rgba(28,62,92,0.88),rgba(12,31,49,0.88))] p-2 shadow-[0_30px_64px_rgba(2,14,26,0.44)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between rounded-[0.95rem] bg-white/10 px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-sky-100">
                      Localizacao
                    </p>
                    <span className="text-[0.65rem] font-medium text-sky-100/80">
                      Foz do Iguacu
                    </span>
                  </div>
                  {mapEmbed ? (
                    <div
                      className="map-embed mt-2 h-52 overflow-hidden rounded-[0.95rem]"
                      dangerouslySetInnerHTML={{ __html: mapEmbed }}
                    />
                  ) : (
                    <div className="mt-2 flex h-52 items-center justify-center rounded-[0.95rem] bg-white/8 text-sm text-slate-200/75">
                      Mapa em breve
                    </div>
                  )}
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[#173852]" />
                </div>
              </div>
            ) : null}

            {index === 1 ? (
              <div
                className={previewClassName}
                onMouseEnter={() => openPreview(index)}
                onMouseLeave={() => scheduleClosePreview(index)}
              >
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/20 bg-[linear-gradient(140deg,rgba(27,59,86,0.9),rgba(11,31,49,0.9))] p-3 shadow-[0_30px_64px_rgba(2,14,26,0.44)] backdrop-blur-2xl">
                  <div className="mx-2 my-2 rounded-[1rem] border border-[#d0e6d3] bg-[#ecf8ed] p-3 shadow-[0_16px_30px_rgba(8,36,58,0.12)]">
                    <div className="rounded-[0.9rem] bg-[#0f7d6e] px-3 py-2 text-white shadow-[0_8px_18px_rgba(5,66,58,0.28)]">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/82">
                        Atendimento WhatsApp
                      </p>
                      <p className="mt-1 text-sm font-semibold">Iguassu Express Hotel</p>
                    </div>
                    <div className="mt-3 rounded-[0.9rem] bg-[#dcf8c6] p-3">
                      <div className="chat-feed-window h-40 overflow-hidden rounded-[0.75rem] bg-[#d7f3c1] p-2.5">
                        <div
                          className="chat-feed-track space-y-2.5 transition-transform duration-500 ease-out"
                          style={{ transform: `translateY(-${chatOffset}px)` }}
                        >
                          {visibleMessages.map((message, messageIndex) => (
                            <div
                              key={`${message.id}-${messageIndex}`}
                              className={cn(
                                "max-w-[84%] min-h-[70px] rounded-2xl px-3 py-2.5 text-[0.72rem] leading-5 text-slate-700 shadow-sm",
                                message.side === "left"
                                  ? "bg-white"
                                  : "ml-auto bg-[#ebfff1]",
                                messageIndex === visibleMessages.length - 1 && chatStep > 1
                                  ? "chat-bubble-in"
                                  : null,
                              )}
                            >
                              {message.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[#173852]" />
                </div>
              </div>
            ) : null}

            {index === 2 ? (
              <div
                className={previewClassName}
                onMouseEnter={() => openPreview(index)}
                onMouseLeave={() => scheduleClosePreview(index)}
              >
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/20 bg-[linear-gradient(140deg,rgba(30,63,91,0.88),rgba(12,31,49,0.88))] p-2 shadow-[0_30px_64px_rgba(2,14,26,0.44)] backdrop-blur-2xl">
                  <div className="rounded-[0.95rem] bg-white/10 px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-indigo-100">
                      Experiencia Premium
                    </p>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-[0.95rem]">
                    {isPremiumPreviewActive ? (
                      <iframe
                        className="h-56 w-full"
                        src="https://www.youtube.com/embed/YxJpctY88sI?autoplay=1&mute=0&playsinline=1&rel=0&controls=0&modestbranding=1&iv_load_policy=3"
                        title="Experiencia premium no Iguassu Express Hotel"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-white/8 text-sm text-slate-200/75">
                        Carregando preview...
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[#173852]" />
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </aside>
  );
}
