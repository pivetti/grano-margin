const conversionFormulas = [
  {
    title: "Soja CBOT para R$/saca",
    lines: [
      "soja ajustada = soja US$/bushel + premio US$/bushel",
      "soja US$/saca = soja ajustada x (60 / 27,216)",
      "soja R$/saca = soja US$/saca x dolar",
    ],
  },
  {
    title: "Farelo CBOT para R$/ton",
    lines: [
      "farelo US$/ton = farelo US$/short ton / 0,90718474",
      "farelo R$/ton = farelo US$/ton x dolar",
    ],
  },
  {
    title: "Oleo CBOT para R$/ton",
    lines: [
      "oleo US$/libra = oleo cents/libra / 100",
      "oleo US$/kg = oleo US$/libra / 0,45359237",
      "oleo R$/ton = oleo US$/kg x 1000 x dolar",
    ],
  },
];

const marginFormulas = [
  {
    title: "Receita por saca",
    lines: [
      "ton farelo/saca = kg farelo por saca / 1000",
      "ton oleo/saca = kg oleo por saca / 1000",
      "receita farelo = farelo R$/ton x ton farelo/saca",
      "receita oleo = oleo R$/ton x ton oleo/saca",
      "receita total = receita farelo + receita oleo",
    ],
  },
  {
    title: "Descontos comerciais/logisticos",
    lines: [
      "frete farelo = frete farelo R$/ton x ton farelo/saca",
      "frete oleo = frete oleo R$/ton x ton oleo/saca",
      "servicos portuarios = servicos R$/ton x (ton farelo + ton oleo)",
      "taxa portuaria = taxa R$/ton x (ton farelo + ton oleo)",
      "comissao vendedor farelo = receita farelo x percentual / 100",
      "comissao vendedor oleo = receita oleo x percentual / 100",
      "comissao corretor = receita total x percentual / 100",
    ],
  },
  {
    title: "Resultado final",
    lines: [
      "descontos total = soma dos descontos comerciais/logisticos",
      "custo total = soja R$/saca + custos operacionais + descontos total",
      "margem bruta = receita total - soja R$/saca",
      "margem liquida = receita total - custo total",
      "margem % = margem liquida / custo total x 100",
      "soja maxima = receita total - custos operacionais - descontos total",
    ],
  },
];

const calculationNotes = [
  "No modo BRL, a parte de conversao CBOT nao e usada: soja, farelo e oleo ja entram em reais.",
  "No modo CBOT, a comissao do corretor fica zerada no calculo atual.",
  "No modo BRL, fretes, servicos portuarios, taxa portuaria e comissoes dos vendedores ficam zerados no calculo atual.",
  "Se todos os custos comerciais/logisticos forem zero, a formula volta para receita total menos soja e custos operacionais.",
];

function FormulaGroup({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] md:text-base">
        {title}
      </h3>
      <ol className="mt-3 space-y-2">
        {lines.map((line, index) => (
          <li
            key={line}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-sm leading-6 text-[var(--text-secondary)] sm:grid-cols-[2rem_minmax(0,1fr)]"
          >
            <span className="gm-number text-xs font-semibold text-[var(--brand)]">
              {index + 1}
            </span>
            <span className="gm-number min-w-0 break-words">{line}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function CalculationSection() {
  return (
    <section
      id="calculo"
      className="scroll-mt-24 bg-[var(--background)] py-8 text-[var(--text-primary)] md:scroll-mt-20 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
              Como o calculo e feito
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:mt-3 md:text-4xl">
              A conta inteira, na ordem em que o sistema calcula.
            </h2>
          </div>
          <p className="text-sm leading-6 text-[var(--text-secondary)] md:text-base md:leading-7">
            A margem sempre termina em R$/saca. Para chegar nela, o sistema
            converte os precos quando necessario, calcula a receita dos
            derivados por saca, soma os descontos e subtrai tudo do resultado.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-[var(--border-soft)] bg-[var(--background-soft)] p-4 md:mt-8 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Constantes usadas
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <p className="gm-number rounded-md border border-[var(--border-soft)] bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">
              1 saca = 60 kg
            </p>
            <p className="gm-number rounded-md border border-[var(--border-soft)] bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">
              1 bushel soja = 27,216 kg
            </p>
            <p className="gm-number rounded-md border border-[var(--border-soft)] bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">
              1 short ton = 0,90718474 ton
            </p>
            <p className="gm-number rounded-md border border-[var(--border-soft)] bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">
              1 libra = 0,45359237 kg
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
            1. Conversoes do modo CBOT
          </p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {conversionFormulas.map((group) => (
              <FormulaGroup
                key={group.title}
                title={group.title}
                lines={group.lines}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
            2. Margem por saca
          </p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {marginFormulas.map((group) => (
              <FormulaGroup
                key={group.title}
                title={group.title}
                lines={group.lines}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[var(--warning)]/30 bg-[#20180c] p-4 text-xs leading-5 text-amber-100 md:p-5 md:text-sm md:leading-6">
          <p className="font-semibold uppercase tracking-[0.08em]">
            Observacoes do calculo
          </p>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {calculationNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
