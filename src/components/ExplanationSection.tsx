const steps = [
  {
    title: "Compra da soja",
    text: "O usuario informa soja em grao por saca de 60 kg, em reais ou convertido a partir de dolar e CBOT.",
  },
  {
    title: "Esmagamento",
    text: "A saca processada gera rendimentos editaveis de farelo e oleo, sempre em kg por saca.",
  },
  {
    title: "Receita proporcional",
    text: "Os derivados entram em R$/tonelada; por isso o rendimento por saca e dividido por 1000.",
  },
  {
    title: "Margem estimada",
    text: "A receita dos derivados e comparada ao custo da soja e aos custos operacionais por saca.",
  },
];

export function ExplanationSection() {
  const stepsGrid = (
    <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)] md:mt-2 md:line-clamp-none md:text-sm md:leading-6">
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
        <div className="grid gap-5 md:gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
              Margem de esmagamento
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-tight tracking-tight md:mt-3 md:text-4xl">
              Da soja em grao a receita dos derivados, sem misturar unidades.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] md:hidden">
              Calculo direto da margem por saca, sem misturar unidades.
            </p>
            <p className="mt-5 hidden text-base leading-7 text-[var(--text-secondary)] md:block">
              O GranoMargin usa uma estrutura de calculo direta para apoiar
              decisao industrial: custos em R$/saca, derivados em R$/tonelada e
              conversoes internacionais quando a mesa trabalha com dolar e
              Chicago.
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

        <div className="mt-5 rounded-lg border border-[var(--warning)]/30 bg-[#20180c] p-3 text-xs leading-5 text-amber-100 md:mt-10 md:p-5 md:text-sm md:leading-6">
          O resultado e uma margem estimada por saca. Impostos, frete, energia,
          armazenagem, perdas, comissoes, premios e diferencas de qualidade
          podem alterar o resultado economico final.
        </div>
      </div>
    </section>
  );
}
