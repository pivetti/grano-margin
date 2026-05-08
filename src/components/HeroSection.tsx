import Image from "next/image";

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
      className="relative isolate min-h-[82svh] overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
    >
      <Image
        src="/soy-crush-hero.png"
        alt="Fluxo visual do esmagamento de soja gerando farelo e oleo"
        fill
        priority
        className="object-cover opacity-80"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,13,0.98)_0%,rgba(7,10,13,0.9)_46%,rgba(7,10,13,0.34)_100%)]" />
      <div className="absolute inset-0 gm-grid-bg opacity-70" />

      <div className="relative mx-auto grid min-h-[82svh] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)] px-3 py-1 text-sm font-medium text-emerald-100">
            Ferramenta agro-fintech para mesa comercial e industria
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            GranoMargin
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
            Simulador de Crush Margin da Soja para calcular a margem entre soja
            em grao, farelo, oleo, dolar e CBOT com leitura de terminal
            financeiro e confianca enterprise.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Converta corretamente CBOT para R$/saca e R$/tonelada, ou use
            precos manuais ja convertidos em reais.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center rounded-md border border-[var(--brand)] bg-[var(--brand)] px-5 py-3 text-sm font-bold text-[#06100b] shadow-lg shadow-emerald-950/30 transition hover:bg-[#66e7a1]"
            >
              Ir para a calculadora
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-subtle)]"
            >
              Entender a formula
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 border-t border-[var(--border-soft)] pt-6 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
            <div>
              <span className="gm-number block text-2xl font-semibold text-white">
                60 kg
              </span>
              Base por saca
            </div>
            <div>
              <span className="gm-number block text-2xl font-semibold text-white">
                kg/1000
              </span>
              Conversao para tonelada
            </div>
            <div>
              <span className="gm-number block text-2xl font-semibold text-white">
                CBOT
              </span>
              Modo internacional
            </div>
          </div>
        </div>

        <div className="gm-panel-elevated hidden rounded-lg p-4 lg:block">
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
    </section>
  );
}
