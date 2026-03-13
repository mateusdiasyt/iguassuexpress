import { LogoutButton } from "@/components/admin/logout-button";

type AdminHeaderProps = {
  title: string;
  description?: string;
  userName?: string | null;
};

export function AdminHeader({
  title,
  description,
  userName,
}: AdminHeaderProps) {
  return (
    <header className="rounded-[1.8rem] border border-brand/10 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
            Painel administrativo
          </p>
          <h1 className="mt-3 text-4xl leading-none text-slate-950">{title}</h1>
          {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm text-slate-500">
            <p>Conectado como</p>
            <p className="font-semibold text-slate-800">{userName ?? "Administrador"}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
