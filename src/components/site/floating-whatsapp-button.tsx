"use client";

import { formatWhatsAppHref } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
};

export function FloatingWhatsAppButton({ phone }: FloatingWhatsAppButtonProps) {
  const whatsappHref = formatWhatsAppHref(phone, "Ola! Gostaria de fazer uma reserva.");

  return (
    <div className="group fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      <div className="pointer-events-none w-[min(92vw,360px)] translate-y-2 scale-95 rounded-2xl border border-emerald-100/40 bg-white/92 opacity-0 shadow-2xl shadow-slate-900/25 backdrop-blur-md transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
        <div className="rounded-t-2xl bg-emerald-700/95 px-4 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white/20">
              <img src="/whatsapp.png" alt="" aria-hidden="true" className="h-full w-full object-cover p-2" />
            </div>
            <div className="space-y-0.5">
              <p className="font-manrope text-lg font-semibold leading-none">Iguassu Express Hotel</p>
              <p className="text-sm font-medium text-emerald-100">Costuma responder em minutos</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 bg-[#ece5dd] px-4 py-4">
          <div className="max-w-[78%] rounded-2xl rounded-tl-sm border border-slate-200/70 bg-white px-4 py-3 text-[15px] leading-relaxed text-slate-800 shadow-sm">
            Olá 👋
            <br />
            Como posso te ajudar?
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-manrope text-lg font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            <img src="/whatsapp.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
            Iniciar Chat
          </a>
        </div>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp"
        className="transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-12 w-12 object-contain" />
      </a>
    </div>
  );
}
