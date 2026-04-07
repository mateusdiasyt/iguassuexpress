import Image from "next/image";

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
  const titleLines = title
    .split(/<p>/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section
      data-floating-nav-theme="dark"
      className="relative -mx-4 min-h-[100svh] overflow-hidden rounded-none px-5 text-white md:-mx-6 md:px-10"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(7,27,42,0.7),rgba(11,54,88,0.48),rgba(16,54,82,0.22))]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center pt-28 pb-10 md:pt-36">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-10">
          <div className="max-w-2xl pt-12 md:pt-20 lg:pt-10">
            <p className="hero-intro hero-intro-delay-1 mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-white/70">
              Iguassu Express Hotel
            </p>
            <h1 className="hero-intro hero-intro-delay-2 max-w-2xl text-[3.3rem] leading-[0.9] font-extrabold tracking-[-0.05em] md:text-[4.9rem]">
              {titleLines.length > 1
                ? titleLines.map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < titleLines.length - 1 ? <br /> : null}
                    </span>
                  ))
                : title}
            </h1>
            <p className="hero-intro hero-intro-delay-3 mt-5 max-w-xl text-sm leading-7 text-white/78 md:text-base md:leading-8">
              {subtitle}
            </p>
          </div>
          <div
            id="reserva"
            className="hero-intro hero-intro-delay-4 w-full lg:justify-self-end lg:self-center"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
