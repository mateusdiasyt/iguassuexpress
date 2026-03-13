"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="inline-flex items-center gap-2 rounded-full border border-brand/10 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand/5"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
