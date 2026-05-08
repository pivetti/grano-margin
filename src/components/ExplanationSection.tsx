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
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-y border-[var(--border-soft)] bg-[var(--background-soft)] py-16 text-[var(--text-primary)] sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
              Margem de esmagamento
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Da soja em grao a receita dos derivados, sem misturar unidades.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              O GranoMargin usa uma estrutura de calculo direta para apoiar
              decisao industrial: custos em R$/saca, derivados em R$/tonelada e
              conversoes internacionais quando a mesa trabalha com dolar e
              Chicago.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand)]">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-[var(--warning)]/30 bg-[#20180c] p-5 text-sm leading-6 text-amber-100">
          O resultado e uma margem estimada por saca. Impostos, frete, energia,
          armazenagem, perdas, comissoes, premios e diferencas de qualidade
          podem alterar o resultado economico final.
        </div>
      </div>
    </section>
  );
}
