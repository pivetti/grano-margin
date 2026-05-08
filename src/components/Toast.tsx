type ToastProps = {
  message: string;
  tone?: "success" | "warning" | "danger" | "neutral";
};

const toneClasses = {
  success: "border-[var(--brand)]/35 bg-[var(--brand-soft)] text-emerald-50",
  warning: "border-[var(--warning)]/35 bg-[#3d2b13] text-amber-50",
  danger: "border-red-400/35 bg-red-400/10 text-red-50",
  neutral:
    "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
};

export function Toast({ message, tone = "success" }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className={[
        "rounded-md border px-4 py-3 text-sm leading-6 shadow-2xl shadow-black/20",
        toneClasses[tone],
      ].join(" ")}
    >
      {message}
    </div>
  );
}
