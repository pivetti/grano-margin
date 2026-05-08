import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

type TopbarProps = {
  userName: string;
};

export function Topbar({ userName }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[rgba(7,10,13,0.86)] backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Dashboard
          </p>
          <h1 className="truncate text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
            Ola, {userName}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] sm:inline-flex"
          >
            Site publico
          </Link>
          <Link
            href="/perfil"
            className="rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
          >
            Perfil
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
