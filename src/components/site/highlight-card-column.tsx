"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, Gem, MapPinned, PawPrint } from "lucide-react";
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
    text: "Claro. Já vou enviar o link com disponibilidade em tempo real.",
  },
  {
    id: "guest-3",
    side: "left" as const,
    text: "Excelente, obrigado!",
  },
];

const PREMIUM_VIDEO_ID = "YxJpctY88sI";
const PREMIUM_VIDEO_EMBED_URL = `https://www.youtube.com/embed/${PREMIUM_VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&modestbranding=1`;

export function HighlightCardColumn({
  cards,
  mapEmbed,
  className,
}: HighlightCardColumnProps) {
  const icons = [MapPinned, CalendarCheck2, Gem, PawPrint];
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const [chatTick, setChatTick] = useState(0);
  const [isPremiumVideoLoaded, setIsPremiumVideoLoaded] = useState(false);
  const [isTouchLayout, setIsTouchLayout] = useState(false);
  const closePreviewTimerRef = useRef<number | null>(null);

  const isReservationPreviewActive = activePreviewIndex === 1;

  function clearCloseTimer() {
    if (closePreviewTimerRef.current) {
      window.clearTimeout(closePreviewTimerRef.current);
      closePreviewTimerRef.current = null;
    }
  }

  function openPreview(index: number) {
    clearCloseTimer();
    if (index === 1) {
      setChatTick(0);
    }
    setIsPremiumVideoLoaded(false);
    setActivePreviewIndex(index);
  }

  function scheduleClosePreview(index: number) {
    clearCloseTimer();
    closePreviewTimerRef.current = window.setTimeout(() => {
      if (index === 2) {
        setIsPremiumVideoLoaded(false);
      }
      setActivePreviewIndex((current) => (current === index ? null : current));
    }, 120);
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const syncLayout = () => {
      setIsTouchLayout(mediaQuery.matches);
      setActivePreviewIndex(null);
      setIsPremiumVideoLoaded(false);
    };

    syncLayout();

    mediaQuery.addEventListener("change", syncLayout);

    return () => mediaQuery.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    if (!isReservationPreviewActive) {
      return;
    }

    const timer = window.setInterval(() => {
      setChatTick((current) => current + 1);
    }, 1100);

    return () => window.clearInterval(timer);
  }, [isReservationPreviewActive]);

  const chatSequence = [1, 2, 3, 4, WHATSAPP_MESSAGES.length, WHATSAPP_MESSAGES.length, WHATSAPP_MESSAGES.length];
  const chatStep = isReservationPreviewActive ? chatSequence[chatTick % chatSequence.length] : 1;
  const visibleMessages = WHATSAPP_MESSAGES.slice(0, chatStep);
  const hiddenCount = Math.max(0, visibleMessages.length - 3);
  const chatOffset = hiddenCount * 78;

  function toggleTouchPreview(index: number) {
    clearCloseTimer();
    setActivePreviewIndex((current) => {
      const nextValue = current === index ? null : index;

      if (nextValue === 1) {
        setChatTick(0);
      }

      if (nextValue !== 2) {
        setIsPremiumVideoLoaded(false);
      }

      return nextValue;
    });
  }

  if (!cards.length) {
    return null;
  }

  return (
    <aside className={cn("grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8", className)}>
      {cards.map((card, index) => {
        const Icon = icons[index] ?? Gem;
        const isPreviewOpen = activePreviewIndex === index;
        const previewClassName = cn(
          "absolute left-1/2 bottom-[calc(100%+0.9rem)] z-40 hidden -translate-x-1/2 transition-all duration-300 ease-out lg:block",
          isPreviewOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
          index === 2 ? "w-[25.5rem]" : "w-[22rem]",
        );

        return (
          <article
            key={card.title}
            className="group relative"
            onMouseEnter={isTouchLayout ? undefined : () => openPreview(index)}
            onMouseLeave={isTouchLayout ? undefined : () => scheduleClosePreview(index)}
          >
            <button
              type="button"
              className="relative flex min-h-[136px] w-full items-center justify-center px-4 py-6 text-center"
              onClick={isTouchLayout ? () => toggleTouchPreview(index) : undefined}
              aria-expanded={isTouchLayout ? isPreviewOpen : undefined}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(9,77,122,0.18),rgba(9,77,122,0))] opacity-0 blur-md transition-all duration-300 group-hover:scale-125 group-hover:opacity-100" />
                  <Icon className="relative h-9 w-9 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-brand" />
                </div>
                <h3 className="max-w-[12rem] text-[1.4rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-slate-950 transition-colors duration-300 group-hover:text-brand md:text-[1.55rem]">
                  {card.title}
                </h3>
                <span className="h-px w-16 bg-slate-200/90 transition-all duration-300 group-hover:w-24 group-hover:bg-brand/45" />
                <p className="max-w-[14rem] text-sm leading-6 text-slate-500 lg:hidden">
                  {card.description}
                </p>
                <span className="rounded-full border border-slate-200/90 bg-white/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:hidden">
                  {isPreviewOpen ? "Toque para recolher" : "Toque para abrir"}
                </span>
              </div>
            </button>

            <div
              className={cn(
                "overflow-hidden px-3 transition-all duration-300 lg:hidden",
                isPreviewOpen ? "max-h-[32rem] pb-4 opacity-100" : "max-h-0 pb-0 opacity-0",
              )}
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/88 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                {index === 0 ? (
                  mapEmbed ? (
                    <div
                      className="map-embed h-48"
                      dangerouslySetInnerHTML={{ __html: mapEmbed }}
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">
                      Mapa em breve
                    </div>
                  )
                ) : null}

                {index === 1 ? (
                  <div className="bg-[#ecf8ed] p-3">
                    <div className="rounded-[1rem] bg-[#0f7d6e] px-3 py-2 text-white shadow-[0_8px_18px_rgba(5,66,58,0.18)]">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/82">
                        Atendimento WhatsApp
                      </p>
                      <p className="mt-1 text-sm font-semibold">Iguassu Express Hotel</p>
                    </div>
                    <div className="mt-3 rounded-[1rem] bg-[#dcf8c6] p-2.5">
                      <div className="chat-feed-window h-40 overflow-hidden rounded-[0.85rem] bg-[#d7f3c1] p-2.5">
                        <div
                          className="chat-feed-track space-y-2.5 transition-transform duration-500 ease-out"
                          style={{ transform: `translateY(-${chatOffset}px)` }}
                        >
                          {visibleMessages.map((message, messageIndex) => (
                            <div
                              key={`${message.id}-${messageIndex}-mobile`}
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
                ) : null}

                {index === 2 ? (
                  <div className="bg-[linear-gradient(140deg,rgba(30,63,91,0.88),rgba(12,31,49,0.88))] p-3">
                    <div className="relative h-56 overflow-hidden rounded-[1rem] bg-slate-950/20">
                      {isPreviewOpen ? (
                        <iframe
                          key={`${PREMIUM_VIDEO_EMBED_URL}-mobile`}
                          src={PREMIUM_VIDEO_EMBED_URL}
                          title="Preview de vídeo da experiência premium"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          onLoad={() => setIsPremiumVideoLoaded(true)}
                          className="h-full w-full border-0"
                        />
                      ) : null}
                      {!isPremiumVideoLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/8 px-6 text-center text-sm text-slate-200/75">
                          Toque para ver a prévia da experiência premium
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {index > 2 ? (
                  <div className="bg-[linear-gradient(145deg,rgba(24,57,84,0.92),rgba(10,28,44,0.92))] p-3">
                    <div className="rounded-[1rem] border border-white/10 bg-white/8 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/68">
                            Diferencial
                          </p>
                          <p className="mt-1 text-base font-semibold">{card.title}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-white/78">{card.description}</p>
                    </div>
                  </div>
                ) : null}
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
                      Localização
                    </p>
                    <span className="text-[0.65rem] font-medium text-sky-100/80">
                      Foz do Iguaçu
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
                <div className="relative overflow-visible rounded-[1.25rem] border border-white/20 bg-[linear-gradient(140deg,rgba(30,63,91,0.88),rgba(12,31,49,0.88))] p-2 shadow-[0_30px_64px_rgba(2,14,26,0.44)] backdrop-blur-2xl">
                  <div className="rounded-[0.95rem] bg-white/10 px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-indigo-100">
                      Experiência Premium
                    </p>
                  </div>
                  <div className="relative mt-2 overflow-visible">
                    <div className="relative h-56 w-full overflow-hidden rounded-[0.95rem] bg-slate-950/20">
                      {isPreviewOpen ? (
                        <iframe
                          key={PREMIUM_VIDEO_EMBED_URL}
                          src={PREMIUM_VIDEO_EMBED_URL}
                          title="Preview de vídeo da experiência premium"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          onLoad={() => setIsPremiumVideoLoaded(true)}
                          className="h-full w-full border-0"
                        />
                      ) : null}
                      {!isPremiumVideoLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/8 text-center text-sm text-slate-200/75">
                          {isPreviewOpen ? "Carregando vídeo..." : "Passe o mouse para assistir"}
                        </div>
                      ) : null}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-slate-950/68 via-slate-950/18 to-transparent px-4 py-3">
                        <span className="rounded-full border border-white/16 bg-white/12 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/78">
                          Vídeo com controles
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[#173852]" />
                </div>
              </div>
            ) : null}

            {index > 2 ? (
              <div
                className={previewClassName}
                onMouseEnter={() => openPreview(index)}
                onMouseLeave={() => scheduleClosePreview(index)}
              >
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/20 bg-[linear-gradient(145deg,rgba(24,57,84,0.92),rgba(10,28,44,0.92))] p-4 shadow-[0_30px_64px_rgba(2,14,26,0.44)] backdrop-blur-2xl">
                  <div className="rounded-[1rem] border border-white/10 bg-white/8 p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-100/80">
                          Diferencial
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">{card.title}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-200/82">{card.description}</p>
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
