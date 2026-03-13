"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { formatWhatsAppHref } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
};

export function FloatingWhatsAppButton({ phone }: FloatingWhatsAppButtonProps) {
  const [open, setOpen] = useState(true);
  const whatsappHref = formatWhatsAppHref(phone, "Ola! Gostaria de fazer uma reserva.");

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden h-10 items-center gap-2 rounded-full border border-white/25 bg-slate-950/55 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 shadow-xl backdrop-blur-xl sm:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </button>
      ) : null}

      {open ? (
        <aside className="hidden w-[320px] overflow-hidden rounded-[1.35rem] border border-white/25 bg-[linear-gradient(160deg,rgba(9,70,60,0.72),rgba(7,43,63,0.68))] text-white shadow-[0_30px_68px_rgba(4,22,36,0.42)] backdrop-blur-xl sm:block">
          <header className="flex items-center justify-between border-b border-white/12 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/18 ring-1 ring-white/25">
                <img src="/whatsapp.png" alt="" className="h-5 w-5 object-contain" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">Iguassu Express</p>
                <p className="mt-1 text-xs text-white/72">Resposta rapida no WhatsApp</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar widget do WhatsApp"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white/80 transition hover:bg-white/16"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="space-y-3 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_58%)] px-4 py-4">
            <div className="max-w-[86%] rounded-2xl bg-white/92 px-3 py-2 text-sm text-slate-700 shadow-sm">
              Ola! Como podemos ajudar hoje?
            </div>
            <div className="max-w-[86%] rounded-2xl bg-white/92 px-3 py-2 text-sm text-slate-700 shadow-sm">
              Consulte disponibilidade ou fale direto com nossa equipe.
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366]/92 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/28 transition hover:bg-[#25D366]"
            >
              <img src="/whatsapp.png" alt="" className="h-4 w-4 object-contain" />
              Chat no WhatsApp
            </a>
          </div>
        </aside>
      ) : null}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#25D366]/95 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-[#25D366]/30 transition hover:bg-[#1ebe5d]"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
        WhatsApp
      </a>
    </div>
  );
}
