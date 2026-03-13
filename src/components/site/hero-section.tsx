import Image from "next/image";
import { CalendarCheck2, Gem, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  image: string;
  cards: Array<{
    title: string;
    description: string;
  }>;
  children?: React.ReactNode;
};

export function HeroSection({
  title,
  subtitle,
  image,
  cards,
  children,
}: HeroSectionProps) {
  const icons = [MapPinned, CalendarCheck2, Gem];

  return (
    <section className="relative -mx-4 -mt-4 min-h-[95vh] overflow-hidden rounded-none px-5 pt-28 pb-10 text-white md:-mx-6 md:px-10 md:pt-36">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,27,43,0.88),rgba(9,77,122,0.62),rgba(9,77,122,0.18))]" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col gap-10">
        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-10">
          <div className="max-w-2xl pt-12 md:pt-20 lg:pt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-white/70">
              Iguassu Express Hotel
            </p>
            <h1 className="max-w-2xl text-[3.3rem] leading-[0.9] font-extrabold tracking-[-0.05em] md:text-[4.9rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 md:text-base md:leading-8">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild>
                <a href="#reserva">Reserve Agora</a>
              </Button>
              <Button asChild variant="ghost" className="border border-white/20">
                <a href="/apartamentos">Ver acomodacoes</a>
              </Button>
            </div>
          </div>
          <div id="reserva" className="w-full lg:justify-self-end lg:self-center">
            {children}
          </div>
        </div>
        <div className="w-full max-w-sm lg:ml-auto">
          <div className="rounded-[1.8rem] border border-white/12 bg-white/7 p-4 shadow-[0_28px_70px_rgba(6,29,46,0.2)] backdrop-blur-xl">
            <div className="grid gap-3">
              {cards.map((card, index) => {
                const Icon = icons[index] ?? Gem;

                return (
                  <article
                    key={card.title}
                    className="rounded-[1.35rem] border border-white/10 bg-white/8 px-5 py-5"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-white/88">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 max-w-[11rem] text-lg leading-[1.02] font-extrabold md:text-[1.95rem]">
                      {card.title}
                    </h2>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
