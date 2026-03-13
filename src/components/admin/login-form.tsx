"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (!result || result.error) {
      setError("Credenciais invalidas. Confira o e-mail e a senha.");
      setLoading(false);
      return;
    }

    window.location.href = result.url ?? "/admin/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6 text-white">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Admin
          </p>
          <h1 className="text-3xl">Entrar no painel</h1>
        </div>
      </div>
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-white/70">
          E-mail
          <Input
            name="email"
            type="email"
            placeholder="admin@hotel.com"
            required
            className="border-white/15 bg-white/12 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Senha
          <Input
            name="password"
            type="password"
            placeholder="Sua senha"
            required
            className="border-white/15 bg-white/12 text-white"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit" className="h-12 bg-white text-brand hover:bg-slate-100">
          {loading ? "Entrando..." : "Acessar painel"}
        </Button>
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
      </div>
    </form>
  );
}
