import Image from "next/image";
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
      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-between gap-12">
        <div className="max-w-2xl pt-12 md:pt-20">
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
        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <article key={card.title} className="glass-panel rounded-[1.8rem] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Destaque
                </p>
                <h2 className="mt-4 text-xl leading-tight font-extrabold md:text-2xl">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
          <div id="reserva">{children}</div>
        </div>
      </div>
    </section>
  );
}
