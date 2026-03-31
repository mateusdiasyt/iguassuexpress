"use client";

import { useActionState, useId, useState } from "react";
import { FileText, Paperclip, Send } from "lucide-react";
import { submitCareerApplication } from "@/actions/public";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

const initialState = { success: false, message: "" };

type CareerApplicationFormProps = {
  jobs: Array<{
    id: string;
    title: string;
  }>;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </span>
  );
}

export function CareerApplicationForm({ jobs }: CareerApplicationFormProps) {
  const [state, formAction] = useActionState(submitCareerApplication, initialState);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputId = useId();

  return (
    <form
      action={formAction}
      className="soft-card rounded-[2rem] p-6 md:p-8 xl:sticky xl:top-28"
      encType="multipart/form-data"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand/70">
            Candidatura
          </p>
          <h2 className="mt-3 text-[2rem] leading-[0.95] font-semibold text-slate-950">
            Envie seu curriculo
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            Escolha a vaga aberta que mais combina com o seu perfil e envie sua candidatura.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/70">
            PDF ou DOC
          </span>
          <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/70">
            Processo direto
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
            required
            className="h-12 rounded-[1.25rem] bg-white/95"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>E-mail</FieldLabel>
          <Input
            type="email"
            name="email"
            placeholder="voce@exemplo.com"
            required
            className="h-12 rounded-[1.25rem] bg-white/95"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Vaga</FieldLabel>
          <Select name="jobId" defaultValue="" required className="h-12 rounded-[1.25rem] bg-white/95">
            <option value="" disabled>
              Selecione uma vaga
            </option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-600">
          <FieldLabel>Mensagem</FieldLabel>
          <Textarea
            name="message"
            placeholder="Conte brevemente sobre sua experiencia, area de interesse e disponibilidade."
            required
            className="min-h-[180px] rounded-[1.6rem] bg-white/95"
          />
        </label>

        <div className="grid gap-2">
          <FieldLabel>Curriculo</FieldLabel>

          <label
            htmlFor={fileInputId}
            className="flex min-h-[78px] cursor-pointer items-center justify-between gap-4 rounded-[1.6rem] border border-brand/10 bg-white/92 px-4 py-4 transition hover:border-brand/20 hover:bg-white"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                <FileText className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-950">Selecionar arquivo</p>
                <p className="truncate text-sm text-slate-500">
                  {selectedFileName || "Anexe um PDF, DOC ou DOCX"}
                </p>
              </div>
            </div>

            <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
              <Paperclip className="h-4 w-4" />
              Alterar
            </span>
          </label>

          <input
            id={fileInputId}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            className="sr-only"
            onChange={(event) => {
              setSelectedFileName(event.target.files?.[0]?.name ?? "");
            }}
          />

          <p className="text-sm text-slate-500">Anexe o curriculo referente a vaga selecionada.</p>
        </div>
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
          <p className="text-sm leading-7 text-slate-500">
            Seus dados sao usados apenas para retorno sobre oportunidades profissionais.
          </p>

          <SubmitButton className="h-12 gap-2 px-5 text-sm normal-case tracking-normal shadow-[0_16px_34px_rgba(9,77,122,0.22)]">
            <Send className="h-4 w-4" />
            Enviar curriculo
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
