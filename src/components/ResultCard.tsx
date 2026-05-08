type ResultCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "positive" | "warning" | "danger" | "strong";
};

const toneClasses = {
  neutral:
    "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-primary)]",
  positive:
    "border-[var(--brand)]/30 bg-[var(--brand-soft)] text-emerald-50",
  warning: "border-[var(--warning)]/35 bg-[#3d2b13] text-amber-50",
  danger: "border-red-400/30 bg-red-400/10 text-red-50",
  strong: "border-[var(--brand)]/45 bg-[rgba(61,220,132,0.14)] text-emerald-50",
};

export function ResultCard({
  label,
  value,
  helper,
  tone = "neutral",
}: ResultCardProps) {
  return (
    <article
      className={`rounded-lg border p-3 transition duration-200 hover:border-[var(--border)] md:p-4 md:hover:-translate-y-0.5 ${toneClasses[tone]}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] opacity-75">
        {label}
      </p>
      <p className="gm-number mt-1.5 text-lg font-semibold leading-tight md:mt-2 md:text-2xl">
        {value}
      </p>
      {helper ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 opacity-70 md:mt-2 md:line-clamp-none">
          {helper}
        </p>
      ) : null}
    </article>
  );
}
