import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminShellProps = {
  title: string;
  description?: string;
  pathname: string;
  userName?: string | null;
  children: React.ReactNode;
};

export function AdminShell({
  title,
  description,
  pathname,
  userName,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname={pathname} />
        <div className="space-y-6">
          <AdminHeader title={title} description={description} userName={userName} />
          {children}
        </div>
      </div>
    </div>
  );
}
