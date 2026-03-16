import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  badge?: string;
};

export function PageHero({ title, subtitle, image, badge }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-brand-deep px-6 text-white shadow-[0_40px_90px_rgba(6,45,71,0.35)] md:px-10">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-35"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/95 via-brand/85 to-brand-deep/75" />
      <div className="relative mx-auto max-w-5xl pt-32 pb-16">
        {badge ? (
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/85">
            {badge}
          </span>
        ) : null}
        <h1 className="mt-6 max-w-3xl text-[2.9rem] leading-[0.92] font-extrabold tracking-[-0.05em] md:text-[4rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 md:text-base md:leading-8">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
