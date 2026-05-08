import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppShellProps = {
  userName: string;
  historicosCount: number;
  children: ReactNode;
};

export function AppShell({
  userName,
  historicosCount,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <Sidebar historicosCount={historicosCount} />
        <div className="min-w-0 flex-1">
          <Topbar userName={userName} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
