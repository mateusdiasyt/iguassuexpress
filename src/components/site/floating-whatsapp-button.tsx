"use client";

import { formatWhatsAppHref } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
};

export function FloatingWhatsAppButton({ phone }: FloatingWhatsAppButtonProps) {
  const whatsappHref = formatWhatsAppHref(phone, "Ola! Gostaria de fazer uma reserva.");

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp"
      className="fixed right-5 bottom-5 z-50 transition-transform duration-200 hover:scale-105"
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="h-12 w-12 object-contain" />
    </a>
  );
}
