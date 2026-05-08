import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "subtle" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--brand)] bg-[var(--brand)] text-[#06100b] hover:bg-[#66e7a1] disabled:hover:bg-[var(--brand)]",
  secondary:
    "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:border-[var(--brand-dark)] hover:bg-[var(--brand-soft)]",
  subtle:
    "border-[var(--border-soft)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]",
  danger:
    "border-red-400/25 bg-red-400/10 text-red-100 hover:border-red-400/40 hover:bg-red-400/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2 text-xs",
  md: "min-h-11 px-4 py-2.5 text-sm",
};

export function Button({
  children,
  className = "",
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
