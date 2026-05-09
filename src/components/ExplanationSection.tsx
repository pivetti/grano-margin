const steps = [
  {
    title: "Entrada da soja",
    text: "No modo BRL, a soja entra diretamente em R$/saca. No modo CBOT, a cotação entra em US$/bushel e pode ser ajustada por prêmio ou deságio.",
  },
  {
    title: "Ajuste CBOT",
    text: "A soja ajustada soma a cotação CBOT e o prêmio/deságio antes da conversão para R$/saca de 60 kg.",
  },
  {
    title: "Derivados",
    text: "Farelo e óleo são convertidos para R$/tonelada métrica antes da aplicação dos rendimentos industriais.",
  },
  {
    title: "Resultado por saca",
    text: "A margem líquida compara a receita proporcional de farelo e óleo contra o custo da soja e os custos operacionais por saca.",
  },
  {
    title: "Preço máximo",
    text: "O sistema calcula o preço máximo da soja para margem zero, ajudando a identificar o limite de compra.",
  },
  {
    title: "Histórico",
    text: "Cenários podem ser salvos para comparar premissas, recuperar simulações e auditar decisões anteriores.",
  },
];

export function ExplanationSection() {
  const stepsGrid = (
    <div className="grid gap-3 md:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {steps.map((step, index) => (
        <article
          key={step.title}
          className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3 transition duration-200 hover:border-[var(--border)] md:block md:p-5 md:hover:-translate-y-0.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)] md:h-9 md:w-9 md:text-sm">
            {index + 1}
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight md:mt-4 md:text-lg">
              {step.title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] md:mt-2 md:text-sm md:leading-6">
              {step.text}
            </p>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-y border-[var(--border-soft)] bg-[var(--background-soft)] py-8 text-[var(--text-primary)] md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
              Margem de esmagamento
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-tight tracking-tight md:mt-3 md:text-4xl">
              Da compra da soja à margem dos derivados, com prêmio/deságio sobre a CBOT.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] md:hidden">
              Cálculo por saca com conversão de unidades e prêmio/deságio da
              soja.
            </p>
            <p className="mt-5 hidden text-base leading-7 text-[var(--text-secondary)] md:block">
              O GranoMargin usa uma estrutura de cálculo direta para apoiar a
              decisão industrial: soja em R$/saca ou CBOT ajustada por
              prêmio/deságio, derivados em R$/tonelada, rendimentos em kg por
              saca e margem final sempre em R$/saca.
            </p>
          </div>

          <details className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3 md:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">
              Ver como funciona
            </summary>
            <div className="mt-3">{stepsGrid}</div>
          </details>

          <div className="hidden md:block">{stepsGrid}</div>
        </div>

        <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3 md:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Soja CBOT
            </p>
            <p className="gm-number mt-2 text-sm font-semibold text-[var(--text-primary)] md:text-base">
              (CBOT + prêmio) x bushels/saca x dólar
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3 md:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Receita
            </p>
            <p className="gm-number mt-2 text-sm font-semibold text-[var(--text-primary)] md:text-base">
              farelo + óleo, proporcionais por saca
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-3 md:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Margem líquida
            </p>
            <p className="gm-number mt-2 text-sm font-semibold text-[var(--text-primary)] md:text-base">
              receita total - soja - custos operacionais
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[var(--warning)]/30 bg-[#20180c] p-3 text-xs leading-5 text-amber-100 md:mt-10 md:p-5 md:text-sm md:leading-6">
          O prêmio/deságio da soja é aplicado somente no modo CBOT. No modo BRL, o
          preço informado em R$/saca já deve carregar prêmio, frete, qualidade e
          demais ajustes comerciais. Impostos, energia, armazenagem, perdas,
          comissões e diferenças de qualidade podem alterar o resultado
          econômico final.
        </div>
      </div>
    </section>
  );
}
