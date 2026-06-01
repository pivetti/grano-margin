import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[rgba(7,10,13,0.86)] text-[var(--text-primary)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl flex-col px-3 sm:min-h-16 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <Link
          href="/"
          className="flex min-h-14 min-w-0 items-center sm:min-h-16 md:min-h-0"
        >
          <span className="flex min-w-0 flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">
              GranoMargin
            </span>
          </span>
        </Link>

        <nav className="-mx-3 flex gap-1 overflow-x-auto border-t border-[var(--border-soft)] px-3 pb-2 text-xs text-[var(--text-secondary)] sm:-mx-6 sm:px-6 md:mx-0 md:items-center md:gap-7 md:overflow-visible md:border-t-0 md:px-0 md:pb-0 md:text-sm">
          <Link
            className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] md:px-0 md:py-0 md:hover:bg-transparent"
            href="/#calculadora"
          >
            Calculadora
          </Link>
          <Link
            className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] md:px-0 md:py-0 md:hover:bg-transparent"
            href="/#historico"
          >
            Historico
          </Link>
          <Link
            className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] md:px-0 md:py-0 md:hover:bg-transparent"
            href="/#como-funciona"
          >
            Como funciona
          </Link>
          <Link
            className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] md:px-0 md:py-0 md:hover:bg-transparent"
            href="/#calculo"
          >
            Calculo
          </Link>
          <Link
            className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/[0.04] hover:text-[var(--text-primary)] md:px-0 md:py-0 md:hover:bg-transparent"
            href="/#beneficios"
          >
            Beneficios
          </Link>
        </nav>
      </div>
    </header>
  );
}
