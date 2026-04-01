import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type RestaurantHighlightProps = {
  title: string;
  description: string;
  image?: string | null;
  categoryCount: number;
  itemCount: number;
};

export function RestaurantHighlight({
  title,
  description,
  image,
  categoryCount,
  itemCount,
}: RestaurantHighlightProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:items-center">
      <div className="relative mx-auto w-full max-w-[540px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
          <div className="relative aspect-[1.02]">
            {image ? (
              <Image src={image} alt={title} fill className="object-cover" sizes="540px" />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(145deg,#dfe9f2,#c8d7e4_48%,#aac0d3)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/42 via-slate-950/8 to-white/12" />
          </div>

          <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/35 bg-white/18 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)] backdrop-blur-md">
              Cardapio Smart Express
            </span>
            <span className="rounded-full border border-white/35 bg-white/14 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur-md">
              Restaurante
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/18 bg-slate-950/34 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/62">
              Leitura premium
            </p>
            <p className="mt-2 max-w-[16rem] text-lg font-semibold leading-tight text-white">
              Categorias, valores e destaques do menu em uma experiencia visual mais forte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/84">
                {categoryCount} categorias
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/84">
                {itemCount} itens
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/75">
          Restaurante
        </p>
        <h3 className="mt-4 max-w-[12ch] text-[2.5rem] leading-[0.92] font-extrabold tracking-[-0.05em] text-slate-950 md:text-[3.3rem]">
          Cardapio Smart Express
        </h3>
        <p className="mt-5 max-w-[34rem] text-base leading-8 text-slate-600">
          Explore o restaurante do hotel em um menu interativo, com categorias, imagens, precos e destaque visual para cada momento da estada.
        </p>
        <p className="mt-4 max-w-[34rem] text-sm leading-7 text-slate-500">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/restaurante"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#094d7a_0%,#0b5e94_100%)] px-7 text-base font-semibold !text-white [color:#fff] shadow-[0_20px_42px_rgba(9,77,122,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:!text-white hover:[color:#fff] hover:bg-[linear-gradient(135deg,#062d47_0%,#094d7a_100%)] hover:shadow-[0_24px_46px_rgba(6,45,71,0.32)] visited:!text-white visited:[color:#fff]"
            style={{ color: "#ffffff" }}
          >
            Ver Cardapio Smart
            <ArrowUpRight className="h-4 w-4 !text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
