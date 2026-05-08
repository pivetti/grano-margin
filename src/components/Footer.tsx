export function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--background-soft)] py-8 text-[var(--text-secondary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-semibold text-[var(--text-primary)]">
          Copyright (c) 2026 Henrique Belgrovicz Pivetti. All rights reserved.
        </p>
        <p>
          Historico da conta salvo no perfil do usuario com sessao segura.
        </p>
      </div>
    </footer>
  );
}
