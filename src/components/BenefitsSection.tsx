const benefits = [
  {
    title: "Mesa comercial",
    text: "Compare cenarios CBOT e precos manuais em reais com leitura rapida de margem e status.",
  },
  {
    title: "Gestao industrial",
    text: "Padronize rendimentos, custos operacionais e preco maximo de compra para margem zero.",
  },
  {
    title: "Historico da conta",
    text: "Salve cenarios no perfil do usuario e recupere premissas usadas em simulacoes anteriores.",
  },
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
            Baixo ruido visual, alta densidade de decisao.
          </h2>
        </div>

        <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="gm-panel rounded-lg p-3 transition duration-200 hover:border-[var(--border)] md:p-5 md:hover:-translate-y-0.5"
            >
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] md:text-lg">
                {benefit.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)] md:mt-3 md:line-clamp-none md:text-sm md:leading-6">
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
