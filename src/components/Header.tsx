import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[rgba(7,10,13,0.86)] text-[var(--text-primary)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/#topo" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--brand)]/45 bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand)]">
            GM
          </span>
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="text-sm font-semibold tracking-tight">
              GranoMargin
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Silo Dark Financial Terminal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--text-secondary)] md:flex">
          <Link className="transition hover:text-[var(--text-primary)]" href="/#como-funciona">
            Como funciona
          </Link>
          <Link className="transition hover:text-[var(--text-primary)]" href="/#beneficios">
            Beneficios
          </Link>
          <Link className="transition hover:text-[var(--text-primary)]" href="/#calculadora">
            Calculadora
          </Link>
          <Link className="transition hover:text-[var(--text-primary)]" href="/#historico">
            Historico
          </Link>
          {user ? (
            <Link className="transition hover:text-[var(--text-primary)]" href="/dashboard">
              Dashboard
            </Link>
          ) : null}
        </nav>

        {user ? (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/perfil"
              className="hidden max-w-36 truncate text-sm font-semibold text-[var(--brand)] sm:block"
            >
              {user.nome}
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="rounded-md border border-[var(--border-soft)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="rounded-md border border-[var(--brand)] bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-[#06100b] shadow-sm transition hover:bg-[#66e7a1]"
            >
              Cadastro
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
