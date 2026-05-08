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
      className="scroll-mt-20 bg-[var(--background)] py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
            SaaS B2B para agroindustria
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Baixo ruido visual, alta densidade de decisao.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="gm-panel rounded-lg p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border)]"
            >
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
