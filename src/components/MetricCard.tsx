type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  accent?: "brand" | "soy" | "meal" | "oil" | "info";
};

const accentClasses = {
  brand: "from-[rgba(61,220,132,0.16)]",
  soy: "from-[rgba(215,164,65,0.16)]",
  meal: "from-[rgba(127,174,74,0.16)]",
  oil: "from-[rgba(217,139,43,0.16)]",
  info: "from-[rgba(110,139,255,0.14)]",
};

export function MetricCard({
  label,
  value,
  helper,
  accent = "brand",
}: MetricCardProps) {
  return (
    <article
      className={[
        "rounded-lg border border-[var(--border-soft)] bg-gradient-to-b to-transparent p-4 transition duration-200 hover:border-[var(--border)]",
        accentClasses[accent],
      ].join(" ")}
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="gm-number mt-2 text-2xl font-semibold leading-tight text-[var(--text-primary)]">
        {value}
      </p>
      {helper ? (
        <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
          {helper}
        </p>
      ) : null}
    </article>
  );
}
