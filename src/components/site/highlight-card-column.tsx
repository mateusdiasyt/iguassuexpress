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

export function HighlightCardColumn({
  cards,
  mapEmbed,
  className,
}: HighlightCardColumnProps) {
  const icons = [MapPinned, CalendarCheck2, Gem];

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
          >
            <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,251,255,0.9))] p-6 shadow-[0_16px_34px_rgba(8,36,58,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[0_24px_46px_rgba(8,36,58,0.13)] md:min-h-[162px] md:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand/[0.06] blur-2xl transition-transform duration-300 group-hover:scale-110" />
              <div className="flex items-center gap-4 text-left md:gap-5">
                <Icon className="h-8 w-8 flex-none text-brand md:h-9 md:w-9" />
                <h3 className="max-w-[12rem] text-[1.45rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-slate-950 md:text-[1.62rem]">
                  {card.title}
                </h3>
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
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white" />
                </div>
              </div>
            ) : null}

            {index === 1 ? (
              <div className={previewClassName}>
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/80 bg-[#eef7f1] p-2 shadow-[0_28px_58px_rgba(8,36,58,0.24)] backdrop-blur-xl">
                  <div className="rounded-[0.95rem] bg-[#0f7d6e] px-3 py-2 text-white">
                    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.2em] text-white/80">
                      Atendimento WhatsApp
                    </p>
                    <p className="mt-1 text-sm font-semibold">Iguassu Express Hotel</p>
                  </div>
                  <div className="mt-2 space-y-2 rounded-[0.95rem] bg-[#d9fdd3] p-3">
                    <div className="max-w-[86%] rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-75">
                      Ola! Gostaria de reservar para 2 adultos.
                    </div>
                    <div className="ml-auto max-w-[86%] rounded-2xl bg-[#ecfff7] px-3 py-2 text-xs leading-5 text-slate-700 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150">
                      Perfeito. Posso enviar a melhor tarifa direto pelo motor oficial.
                    </div>
                    <div className="max-w-[86%] rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-200">
                      Maravilha, pode me passar o link?
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
