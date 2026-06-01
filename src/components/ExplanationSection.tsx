const flowSteps = [
  {
    label: "1",
    title: "Precos de entrada",
    text: "Voce informa a soja, o farelo e o oleo. No modo BRL, tudo ja entra em reais. No modo CBOT, a calculadora converte as cotacoes internacionais para reais.",
  },
  {
    label: "2",
    title: "Rendimento industrial",
    text: "A receita e calculada com base em quantos kg de farelo e oleo saem de uma saca de 60 kg de soja.",
  },
  {
    label: "3",
    title: "Custos e descontos",
    text: "Depois entram custos operacionais, fretes, servicos portuarios, taxas portuarias e comissoes, conforme o modo escolhido.",
  },
  {
    label: "4",
    title: "Margem final",
    text: "A margem liquida mostra quanto sobra por saca depois de descontar soja, custos operacionais e custos comerciais/logisticos.",
  },
];

const cbotFields = [
  {
    name: "Soja CBOT",
    use: "Cotacao da soja em US$/bushel.",
  },
  {
    name: "Premio da soja",
    use: "Ajuste em US$/bushel. Use positivo para premio e negativo para desagio.",
  },
  {
    name: "Farelo CBOT",
    use: "Preco do farelo em US$/short ton, convertido para R$/ton.",
  },
  {
    name: "Oleo CBOT",
    use: "Preco do oleo em centavos de dolar por libra, convertido para R$/ton.",
  },
  {
    name: "Frete do farelo",
    use: "Custo em R$/ton aplicado somente sobre as toneladas de farelo geradas por saca.",
  },
  {
    name: "Frete do oleo",
    use: "Custo em R$/ton aplicado somente sobre as toneladas de oleo geradas por saca.",
  },
  {
    name: "Servicos portuarios",
    use: "Custo em R$/ton aplicado sobre farelo + oleo produzidos por saca.",
  },
  {
    name: "Taxa portuaria",
    use: "Taxa em R$/ton aplicada sobre farelo + oleo produzidos por saca.",
  },
  {
    name: "Comissao vendedor farelo",
    use: "Percentual descontado da receita do farelo.",
  },
  {
    name: "Comissao vendedor oleo",
    use: "Percentual descontado da receita do oleo.",
  },
];

const brlFields = [
  {
    name: "Soja em grao",
    use: "Preco final da soja em R$/saca, ja com ajustes comerciais que voce quiser considerar.",
  },
  {
    name: "Farelo de soja",
    use: "Preco final do farelo em R$/ton.",
  },
  {
    name: "Oleo de soja",
    use: "Preco final do oleo em R$/ton.",
  },
  {
    name: "Comissao corretor",
    use: "Percentual descontado da receita total dos derivados.",
  },
];

const sharedFields = [
  {
    name: "Rendimento do farelo",
    use: "Kg de farelo gerados por uma saca de 60 kg.",
  },
  {
    name: "Rendimento do oleo",
    use: "Kg de oleo gerados por uma saca de 60 kg.",
  },
  {
    name: "Custos operacionais",
    use: "Custo por saca para industrializacao, perdas, energia ou outros custos internos.",
  },
];

const formulaBlocks = [
  {
    title: "Receita dos derivados",
    lines: [
      "Receita farelo = preco farelo R$/ton x kg farelo / 1000",
      "Receita oleo = preco oleo R$/ton x kg oleo / 1000",
      "Receita total = receita farelo + receita oleo",
    ],
  },
  {
    title: "Descontos comerciais/logisticos",
    lines: [
      "Fretes e taxas em R$/ton viram custo por saca usando kg / 1000",
      "Comissao vendedor = receita do derivado x percentual",
      "Comissao corretor = receita total x percentual",
    ],
  },
  {
    title: "Margem liquida",
    lines: [
      "Custo total = soja + custos operacionais + descontos comerciais",
      "Margem liquida = receita total - custo total",
      "Soja maxima = receita total - custos operacionais - descontos comerciais",
    ],
  },
];

const statusRules = [
  { title: "Prejuizo", range: "margem <= 0" },
  { title: "Apertada", range: "0 < margem <= 10" },
  { title: "Boa", range: "10 < margem <= 25" },
  { title: "Excelente", range: "margem > 25" },
];

const faqItems = [
  {
    question: "Qual modo devo usar?",
    answer:
      "Use CBOT quando voce parte de cotacoes internacionais. Use BRL quando ja tem os precos finais em reais.",
  },
  {
    question: "Onde entram os novos custos?",
    answer:
      "No CBOT, fretes, servicos portuarios, taxa portuaria e comissoes dos vendedores reduzem a margem. No BRL, a comissao do corretor reduz a margem sobre a receita total dos derivados.",
  },
  {
    question: "Por que dividir por 1000?",
    answer:
      "Porque farelo e oleo estao em R$/tonelada, mas o rendimento e informado em kg por saca. Dividir por 1000 transforma kg em tonelada.",
  },
  {
    question: "O resultado e lucro final?",
    answer:
      "Nao. E uma simulacao por saca baseada nos campos preenchidos. Impostos, contratos, qualidade, perdas reais e custos fora da tela podem mudar o resultado final.",
  },
];

function FieldList({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ name: string; use: string }>;
}) {
  return (
    <article className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-5">
      <div className="border-b border-[var(--border-soft)] pb-3">
        <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] md:text-sm md:leading-6">
          {description}
        </p>
      </div>

      <dl className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="grid gap-1 sm:grid-cols-[180px_1fr]">
            <dt className="min-w-0 break-words text-sm font-semibold text-[var(--text-primary)]">
              {item.name}
            </dt>
            <dd className="min-w-0 break-words text-sm leading-6 text-[var(--text-secondary)]">
              {item.use}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function ExplanationSection() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-y border-[var(--border-soft)] bg-[var(--background-soft)] py-8 text-[var(--text-primary)] md:scroll-mt-20 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] md:text-sm">
              Como funciona
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:mt-3 md:text-4xl">
              Da cotacao ate a margem liquida por saca.
            </h2>
          </div>
          <p className="text-sm leading-6 text-[var(--text-secondary)] md:text-base md:leading-7">
            A calculadora coloca tudo na mesma base: R$/saca de 60 kg. Primeiro
            calcula a receita do farelo e do oleo, depois desconta a soja, os
            custos operacionais e os custos comerciais/logisticos.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-4">
          {flowSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4"
            >
              <span className="gm-number flex h-8 w-8 items-center justify-center rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                {step.label}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-[var(--text-primary)] md:text-base">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)] md:text-sm md:leading-6">
                {step.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <FieldList
            title="Modo CBOT"
            description="Use quando a simulacao parte de mercado internacional e precisa converter unidades."
            items={cbotFields}
          />
          <FieldList
            title="Modo BRL"
            description="Use quando os precos ja estao fechados em reais."
            items={brlFields}
          />
        </div>

        <div className="mt-4">
          <FieldList
            title="Campos comuns aos dois modos"
            description="Esses campos sempre entram na conta, independentemente da origem dos precos."
            items={sharedFields}
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
              Formula em palavras
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-3xl">
              O resultado final e uma subtracao simples depois das conversoes.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              As conversoes so servem para deixar tudo comparavel. Depois que
              soja, farelo, oleo e custos estao em reais por saca, a leitura
              fica direta.
            </p>
          </div>

          <div className="grid gap-3">
            {formulaBlocks.map((block) => (
              <article
                key={block.title}
                className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4"
              >
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  {block.title}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {block.lines.map((line) => (
                    <li key={line} className="break-words">
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
              Status da margem
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {statusRules.map((rule) => (
                <div
                  key={rule.title}
                  className="rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] p-3"
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {rule.title}
                  </p>
                  <p className="gm-number mt-1 text-xs text-[var(--brand)]">
                    {rule.range}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
              Duvidas rapidas
            </p>
            <div className="mt-3 grid gap-2">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] p-3"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
