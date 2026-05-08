"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

const initialForm: RegisterInput = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

function formatFieldErrors(
  errors: Partial<Record<keyof RegisterInput, string[] | undefined>>,
) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, messages?.[0]]),
  ) as FieldErrors;
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const parsed = registerSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(formatFieldErrors(parsed.error.flatten().fieldErrors));
      return;
    }

    setErrors({});
    setSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json().catch(() => null);
    setSubmitting(false);

    if (!response.ok) {
      setMessage(data?.error ?? "Nao foi possivel criar a conta.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div>
        <label htmlFor="nome" className="block text-sm font-semibold">
          Nome
        </label>
        <input
          id="nome"
          autoComplete="name"
          value={form.nome}
          onChange={(event) =>
            setForm((current) => ({ ...current, nome: event.target.value }))
          }
          className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
        />
        {errors.nome ? (
          <p className="mt-2 text-sm text-red-300">{errors.nome}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-300">{errors.email}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="senha" className="block text-sm font-semibold">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="new-password"
            value={form.senha}
            onChange={(event) =>
              setForm((current) => ({ ...current, senha: event.target.value }))
            }
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
          />
          {errors.senha ? (
            <p className="mt-2 text-sm text-red-300">{errors.senha}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmarSenha"
            className="block text-sm font-semibold"
          >
            Confirmar senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            autoComplete="new-password"
            value={form.confirmarSenha}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                confirmarSenha: event.target.value,
              }))
            }
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
          />
          {errors.confirmarSenha ? (
            <p className="mt-2 text-sm text-red-300">
              {errors.confirmarSenha}
            </p>
          ) : null}
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-100">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-bold text-[#07130f] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
