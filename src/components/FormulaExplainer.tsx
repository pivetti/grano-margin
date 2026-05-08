export function FormulaExplainer() {
  return (
    <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">
        Formula preservada
      </p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
        <p>
          Receita farelo = preco farelo ton x kg farelo por saca / 1000.
        </p>
        <p>Receita oleo = preco oleo ton x kg oleo por saca / 1000.</p>
        <p>
          Margem liquida = receita farelo + receita oleo - preco soja saca -
          custos operacionais por saca.
        </p>
      </div>
    </div>
  );
}
