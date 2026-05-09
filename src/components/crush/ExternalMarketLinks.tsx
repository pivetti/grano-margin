import { EXTERNAL_MARKET_LINKS } from "@/lib/external-market-links";

type ExternalMarketLinksProps = {
  className?: string;
};

const links = Object.values(EXTERNAL_MARKET_LINKS);

export function ExternalMarketLinks({
  className = "",
}: ExternalMarketLinksProps) {
  return (
    <section
      id="consultar-cotacoes-externas"
      className={[
        "scroll-mt-24 rounded-lg border border-[var(--border-soft)] bg-[var(--background-soft)] p-4",
        className,
      ].join(" ")}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
          Consultar cotacoes externas
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Abra as fontes externas, confira a cotacao e informe os valores
          manualmente nos campos da calculadora. O sistema nao redistribui
          cotacoes de mercado em tempo real.
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label}. ${link.description}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-center text-sm font-semibold text-[var(--text-primary)] transition duration-200 hover:border-[var(--brand-dark)] hover:bg-[var(--brand-soft)] focus-visible:border-[var(--brand)]"
          >
            <span>{link.label}</span>
            <span aria-hidden="true" className="text-[var(--brand)]">
              ↗
            </span>
          </a>
        ))}
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
        As cotacoes e informacoes exibidas nos sites externos sao de
        responsabilidade de seus respectivos provedores. Utilize os valores
        apenas apos conferencia manual.
      </p>
    </section>
  );
}
