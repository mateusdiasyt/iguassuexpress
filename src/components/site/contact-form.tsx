"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/actions/public";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

const initialState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="soft-card rounded-[1.8rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-600">
          Nome
          <Input name="name" placeholder="Seu nome" required />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          Telefone
          <Input name="phone" placeholder="+55 45 99999-9999" />
        </label>
      </div>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-600">
          E-mail
          <Input type="email" name="email" placeholder="voce@exemplo.com" required />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          Mensagem
          <Textarea name="message" placeholder="Como podemos ajudar?" required />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton>Enviar mensagem</SubmitButton>
        {state.message ? (
          <p className={state.success ? "text-sm text-emerald-600" : "text-sm text-red-500"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
