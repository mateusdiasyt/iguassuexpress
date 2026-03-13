"use client";

import { useEffect, useState } from "react";
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

const MAPS_LOCATION_URL = "https://maps.app.goo.gl/5Y9ZPvuxtNn3fs5s9";

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

export function HighlightCardColumn({
  cards,
  mapEmbed,
  className,
}: HighlightCardColumnProps) {
  const icons = [MapPinned, CalendarCheck2, Gem];
  const [isReservationHovered, setIsReservationHovered] = useState(false);
  const [chatStep, setChatStep] = useState(1);

  useEffect(() => {
    if (!isReservationHovered) {
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
  }, [isReservationHovered]);

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
        const previewClassName = cn(
          "pointer-events-none absolute left-1/2 bottom-[calc(100%+0.9rem)] z-40 hidden -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block",
          index === 2 ? "w-[24rem]" : "w-[22rem]",
        );

        return (
          <article
            key={card.title}
            className="group relative rounded-[1.8rem]"
            onMouseEnter={index === 1 ? () => setIsReservationHovered(true) : undefined}
            onMouseLeave={index === 1 ? () => setIsReservationHovered(false) : undefined}
          >
            <div className="relative min-h-[164px] overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,251,255,0.9))] p-6 shadow-[0_16px_34px_rgba(8,36,58,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[0_24px_46px_rgba(8,36,58,0.13)] md:min-h-[172px] md:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand/[0.06] blur-2xl transition-transform duration-300 group-hover:scale-110" />
              <div className="grid min-h-[116px] place-items-center md:min-h-[126px]">
                <div className="flex items-center gap-4 text-left md:gap-5">
                  <Icon className="h-8 w-8 flex-none text-brand md:h-9 md:w-9" />
                  <h3 className="max-w-[12rem] text-[1.45rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-slate-950 md:text-[1.62rem]">
                    {card.title}
                  </h3>
                </div>
              </div>
            </div>

            {index === 0 ? (
              <div className={previewClassName}>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-white/96 p-2 shadow-[0_28px_58px_rgba(8,36,58,0.24)] backdrop-blur-xl">
                  <div className="flex items-center justify-between rounded-[0.95rem] bg-brand/10 px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-brand">
                      Localizacao
                    </p>
                    <span className="text-[0.65rem] font-medium text-brand/70">
                      Foz do Iguacu
                    </span>
                  </div>
                  {mapEmbed ? (
                    <div
                      className="map-embed mt-2 h-52 overflow-hidden rounded-[0.95rem]"
                      dangerouslySetInnerHTML={{ __html: mapEmbed }}
                    />
                  ) : (
                    <div className="mt-2 flex h-52 items-center justify-center rounded-[0.95rem] bg-slate-100 text-sm text-slate-500">
                      Mapa em breve
                    </div>
                  )}
                  <a
                    href={MAPS_LOCATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-[0.8rem] bg-white px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand ring-1 ring-brand/20 transition hover:bg-brand/5"
                  >
                    Abrir no Maps
                  </a>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white" />
                </div>
              </div>
            ) : null}

            {index === 1 ? (
              <div className={previewClassName}>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-[#eef7f1] p-3 shadow-[0_28px_58px_rgba(8,36,58,0.24)] backdrop-blur-xl">
                  <div className="mx-1 rounded-[1rem] border border-[#d5ead8] bg-[#f3fbf4] p-3">
                    <div className="rounded-[0.9rem] bg-[#0f7d6e] px-3 py-2 text-white">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/80">
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
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-[#d8e8dc] bg-[#eef7f1]" />
                </div>
              </div>
            ) : null}

            {index === 2 ? (
              <div className={previewClassName}>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-white/96 p-2 shadow-[0_28px_58px_rgba(8,36,58,0.24)] backdrop-blur-xl">
                  <div className="rounded-[0.95rem] bg-brand/10 px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-brand">
                      Experiencia Premium
                    </p>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-[0.95rem]">
                    <iframe
                      className="h-56 w-full"
                      src="https://www.youtube.com/embed/YxJpctY88sI?autoplay=1&mute=1&playsinline=1&rel=0"
                      title="Experiencia premium no Iguassu Express Hotel"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white" />
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </aside>
  );
}
