import { MessageCircle } from "lucide-react";
import { formatWhatsAppHref } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
};

export function FloatingWhatsAppButton({ phone }: FloatingWhatsAppButtonProps) {
  return (
    <a
      href={formatWhatsAppHref(phone, "Ola! Gostaria de fazer uma reserva.")}
      target="_blank"
      rel="noreferrer"
      className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-3 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand/30 transition hover:bg-brand-deep"
    >
      <MessageCircle className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
