"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta e todos os historicos?",
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/usuarios/me", { method: "DELETE" });

    if (!response.ok) {
      setLoading(false);
      setMessage("Nao foi possivel excluir a conta.");
      return;
    }

    router.push("/cadastro");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-red-300/30 bg-red-400/10 p-5">
      <h2 className="text-xl font-semibold text-white">Excluir conta</h2>
      <p className="mt-2 text-sm leading-6 text-red-100/80">
        Esta acao remove seu usuario e todos os historicos por cascade no banco.
      </p>
      <button
        type="button"
        onClick={deleteAccount}
        disabled={loading}
        className="mt-4 rounded-md border border-red-200/40 px-4 py-2 text-sm font-bold text-red-50 transition hover:bg-red-300/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Excluindo..." : "Excluir minha conta"}
      </button>
      {message ? <p className="mt-3 text-sm text-red-100">{message}</p> : null}
    </div>
  );
}
