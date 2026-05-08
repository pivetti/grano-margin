import type { CrushMarginResult } from "@/lib/calcular-crush-margin";

type Status = CrushMarginResult["status"] | "NEUTRO";

type StatusBadgeProps = {
  status: Status;
  label?: string;
};

const toneByStatus: Record<Status, string> = {
  PREJUIZO: "border-red-400/30 bg-red-400/10 text-red-100",
  APERTADA: "border-[var(--warning)]/40 bg-[#3d2b13] text-amber-100",
  BOA: "border-[var(--profit)]/35 bg-[var(--brand-soft)] text-emerald-100",
  EXCELENTE:
    "border-[var(--brand)]/60 bg-[linear-gradient(180deg,rgba(61,220,132,0.22),rgba(61,220,132,0.09))] text-emerald-50",
  NEUTRO: "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
};

const labelByStatus: Record<Status, string> = {
  PREJUIZO: "Prejuizo",
  APERTADA: "Apertada",
  BOA: "Boa",
  EXCELENTE: "Excelente",
  NEUTRO: "Neutro",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
        toneByStatus[status],
      ].join(" ")}
    >
      {label ?? labelByStatus[status]}
    </span>
  );
}
