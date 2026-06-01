import type { ReactNode } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  action?: ReactNode;
};

export function InputField({
  id,
  label,
  value,
  onChange,
  error,
  helper,
  prefix,
  suffix,
  placeholder = "0,00",
  action,
}: InputFieldProps) {
  return (
    <div>
      <div className="flex min-h-6 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor={id}
          className="block min-w-0 text-sm font-semibold text-[var(--text-primary)]"
        >
          {label}
        </label>
        {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
      </div>
      <div className="mt-1.5 flex min-h-11 rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] transition duration-200 focus-within:border-[var(--brand)] focus-within:bg-[var(--surface)] focus-within:shadow-[var(--focus-ring)] md:mt-2">
        {prefix ? (
          <span className="flex min-w-12 shrink-0 items-center justify-center border-r border-[var(--border-soft)] px-3 text-sm font-medium text-[var(--text-secondary)]">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="decimal"
          className="gm-number min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          placeholder={placeholder}
        />
        {suffix ? (
          <span className="flex shrink-0 items-center border-l border-[var(--border-soft)] px-3 text-sm font-medium text-[var(--text-secondary)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs leading-5 text-red-300 md:mt-2 md:text-sm">
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--text-muted)] md:mt-2 md:line-clamp-none">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
