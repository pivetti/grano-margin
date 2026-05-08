const cbotInputs = [
  ["Dolar PTAX", "R$ 4,9079", "brand"],
  ["Soja CBOT", "US$ 11,77 / bushel", "soy"],
  ["Farelo CBOT", "US$ 320,85 / short ton", "meal"],
  ["Oleo CBOT", "US¢ 74,10 / libra", "oil"],
];

const convertedPrices = [
  ["Soja convertida", "R$ 127,35 / saca"],
  ["Farelo convertido", "R$ 1.735,81 / ton"],
  ["Oleo convertido", "R$ 8.017,67 / ton"],
];

export function HeroSection() {
  return (
    <section
      id="topo"
      className="grano-hero-bg relative isolate min-h-[calc(100svh-3.5rem)] text-[var(--text-primary)] md:min-h-[82svh]"
    >
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-7xl items-center gap-6 px-4 py-8 pb-16 sm:px-6 md:min-h-[82svh] md:gap-10 md:py-16 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-emerald-100 md:mb-5 md:px-3 md:text-sm">
            Ferramenta agro-fintech para mesa comercial e industria
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            GranoMargin
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-6 text-[var(--text-secondary)] md:hidden">
            Simule a margem de esmagamento da soja com CBOT, dolar PTAX e
            precos manuais em reais.
          </p>
          <p className="mt-5 hidden max-w-2xl text-xl leading-8 text-[var(--text-secondary)] md:block">
            Simulador de Crush Margin da Soja para calcular a margem entre soja
            em grao, farelo, oleo, dolar e CBOT com leitura de terminal
            financeiro e confianca enterprise.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] md:mt-4">
            Converta corretamente CBOT para R$/saca e R$/tonelada, ou use
            precos manuais ja convertidos em reais.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-9">
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center rounded-md border border-[var(--brand)] bg-[var(--brand)] px-5 py-3 text-sm font-bold text-[#06100b] shadow-lg shadow-emerald-950/30 transition hover:bg-[#66e7a1]"
            >
              Simular agora
            </a>
            <a
              href="#como-funciona"
              className="hidden items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-subtle)] md:inline-flex"
            >
              Entender a formula
            </a>
          </div>

          <div className="mt-6 grid max-w-2xl grid-cols-3 gap-3 border-t border-[var(--border-soft)] pt-4 text-xs text-[var(--text-secondary)] md:mt-10 md:gap-4 md:pt-6 md:text-sm">
            <div>
              <span className="gm-number block text-lg font-semibold text-white md:text-2xl">
                60 kg
              </span>
              Base por saca
            </div>
            <div>
              <span className="gm-number block text-lg font-semibold text-white md:text-2xl">
                kg/1000
              </span>
              Conversao para tonelada
            </div>
            <div>
              <span className="gm-number block text-lg font-semibold text-white md:text-2xl">
                CBOT
              </span>
              Modo internacional
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-8 rounded-[32px] bg-emerald-500/10 blur-3xl" />
          <div className="gm-panel-elevated relative z-10 rounded-lg p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Preview CBOT
                </p>
                <p className="mt-1 text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  Mercado internacional
                </p>
              </div>
              <span className="rounded-full border border-[var(--brand)]/35 bg-[var(--brand-soft)] px-2 py-1 text-xs font-semibold text-[var(--brand)]">
                PTAX
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {cbotInputs.map(([label, value, tone]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 py-3"
                >
                  <span className="text-sm text-[var(--text-secondary)]">
                    {label}
                  </span>
                  <span
                    className={[
                      "gm-number text-sm font-semibold",
                      tone === "brand"
                        ? "text-[var(--brand)]"
                        : tone === "soy"
                          ? "text-[var(--soy)]"
                          : tone === "meal"
                            ? "text-[var(--meal)]"
                            : "text-[var(--oil)]",
                    ].join(" ")}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Conversao
                </p>
                <span className="text-xs text-[var(--text-muted)]">
                  por saca 60 kg
                </span>
              </div>
              <div className="space-y-2">
                {convertedPrices.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {label}
                    </span>
                    <span className="gm-number text-xs font-semibold text-[var(--text-primary)]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--brand)]/35 bg-[var(--brand-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-100/75">
                Margem liquida
              </p>
              <p className="gm-number mt-2 text-3xl font-semibold text-white">
                R$ 45,29
              </p>
              <p className="mt-2 text-sm text-emerald-100/80">
                Status: excelente margem
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
