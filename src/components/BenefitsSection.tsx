const benefits = [
  {
    title: "Mesa comercial",
    text: "Compare cenários CBOT com prêmio/deságio sobre a CBOT e preços manuais em reais para orientar compra e venda.",
  },
  {
    title: "Gestão industrial",
    text: "Padronize rendimentos de farelo e óleo, custos operacionais e leitura de margem por saca.",
  },
  {
    title: "Preço máximo da soja",
    text: "Veja o limite de compra para margem zero e reduza decisões baseadas apenas no preço nominal.",
  },
  {
    title: "Conversão auditável",
    text: "Confira soja original, prêmio/deságio, soja ajustada, dólar usado e derivados convertidos para reais.",
  },
  {
    title: "Fontes externas",
    text: "Acesse links diretos para soja, prêmio Paranaguá, farelo, óleo e preencha os valores manualmente.",
  },
  {
    title: "Histórico da conta",
    text: "Salve cenários no perfil ou no navegador e recupere premissas usadas em simulações anteriores.",
  },
];

const highlights = [
  "CBOT com prêmio/deságio",
  "BRL sem ajuste duplicado",
  "Margem líquida por saca",
  "Histórico de cenários",
];

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="scroll-mt-20 bg-[var(--background)] py-8 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
            SaaS B2B para agroindustria
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)] md:mt-3 md:text-4xl">
            Menos ruído na cotação, mais clareza na decisão.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] md:mt-4 md:text-base md:leading-7">
            O fluxo concentra premissas comerciais e industriais em uma leitura
            única: entrada da soja, receita dos derivados, custo operacional,
            margem líquida e limite de compra.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
          {highlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="gm-panel rounded-lg p-3 transition duration-200 hover:border-[var(--border)] md:p-5 md:hover:-translate-y-0.5"
            >
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] md:text-lg">
                {benefit.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] md:mt-3 md:text-sm md:leading-6">
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
