import Link from "next/link";

type SidebarProps = {
  historicosCount: number;
};

const navItems = [
  { href: "/dashboard", label: "Calculadora" },
  { href: "/dashboard#historico", label: "Historico" },
  { href: "/perfil", label: "Perfil" },
];

export function Sidebar({ historicosCount }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[var(--border-soft)] bg-[var(--background-soft)] px-4 py-5 lg:sticky lg:top-0 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--brand)]/40 bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand)]">
          GM
        </span>
        <span>
          <span className="block text-sm font-semibold text-[var(--text-primary)]">
            GranoMargin
          </span>
          <span className="block text-xs text-[var(--text-muted)]">
            Design System
          </span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Conta
        </p>
        <p className="gm-number mt-2 text-2xl font-semibold text-[var(--text-primary)]">
          {historicosCount}
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
          cenarios salvos no perfil
        </p>
      </div>
    </aside>
  );
}
