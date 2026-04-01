"use client";

import { useActionState } from "react";
import { Mail, Send } from "lucide-react";
import { submitContactMessage } from "@/actions/public";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

const initialState = { success: false, message: "" };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </span>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);

  return (
    <form
      action={formAction}
      className="soft-card rounded-[2rem] p-6 md:p-8 xl:sticky xl:top-28"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand/70">
            Mensagem
          </p>
          <h2 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
            Escreva para nossa equipe
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            Use o formulário para enviar uma dúvida, solicitar suporte ou falar com o hotel com
            mais contexto.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/70">
            Resposta direta
          </span>
          <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/70">
            Sem mapa
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Nome</FieldLabel>
          <Input
            name="name"
            placeholder="Seu nome completo"
            required
            className="h-12 rounded-[1.25rem] bg-white/95"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Telefone</FieldLabel>
          <Input
            name="phone"
            placeholder="+55 45 99999-9999"
            className="h-12 rounded-[1.25rem] bg-white/95"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
          <FieldLabel>E-mail</FieldLabel>
          <Input
            type="email"
            name="email"
            placeholder="nome@exemplo.com"
            required
            className="h-12 rounded-[1.25rem] bg-white/95"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Mensagem</FieldLabel>
          <Textarea
            name="message"
            placeholder="Conte com mais detalhes como podemos ajudar."
            required
            className="min-h-[200px] rounded-[1.6rem] bg-white/95"
          />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {state.message ? (
          <p
            className={[
              "rounded-[1.25rem] border px-4 py-3 text-sm",
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600",
            ].join(" ")}
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm leading-7 text-slate-500">
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
              <Mail className="h-4 w-4" />
            </span>
            <p>
              Mensagens enviadas por aqui ajudam a centralizar o atendimento quando você precisa
              explicar melhor o contexto.
            </p>
          </div>

          <SubmitButton className="h-12 gap-2 px-5 text-sm normal-case tracking-normal shadow-[0_16px_34px_rgba(9,77,122,0.22)]">
            <Send className="h-4 w-4" />
            Enviar mensagem
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
