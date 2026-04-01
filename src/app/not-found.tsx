import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="soft-card max-w-xl rounded-[2rem] p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
          404
        </p>
        <h1 className="mt-5 text-5xl leading-none text-slate-950">
          Conteúdo não encontrado
        </h1>
        <p className="mt-5 text-sm leading-8 text-slate-600">
          A página solicitada não está disponível. Volte para a home e continue navegando pelo site
          do hotel.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Voltar para a home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
