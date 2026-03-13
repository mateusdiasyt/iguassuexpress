import Image from "next/image";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  image: string;
  children?: React.ReactNode;
};

export function HeroSection({
  title,
  subtitle,
  image,
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
      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-10">
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
      </div>
    </section>
  );
}
