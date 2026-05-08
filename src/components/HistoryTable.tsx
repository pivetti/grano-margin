"use client";

import { useMemo, useState } from "react";
import { formatCurrencyBRL, formatPercent } from "@/lib/formatters";
import type { CalculationMode, CrushMarginResult } from "@/lib/calcular-crush-margin";
import type { CrushMarginHistoryItem } from "@/types/crush-margin";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { SkeletonCard } from "./SkeletonCard";
import { StatusBadge } from "./StatusBadge";

type HistoryTableProps = {
  items: CrushMarginHistoryItem[];
  isAuthenticated: boolean;
  isLoading: boolean;
  onClear: () => void;
  onDelete: (item: CrushMarginHistoryItem) => void;
  onLoad: (item: CrushMarginHistoryItem) => void;
};

type ModeFilter = "ALL" | CalculationMode;
type StatusFilter = "ALL" | CrushMarginResult["status"];
type SortBy = "date-desc" | "date-asc" | "margin-desc" | "margin-asc";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getModeLabel(mode: CalculationMode) {
  if (mode === "CBOT") {
    return "CBOT / Mercado internacional";
  }

  return "Precos manuais em R$";
}

function getEmptyCopy(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return {
      title: "Nenhum cenario local salvo ainda",
      description:
        "Salve uma simulacao para manter o cenario neste navegador. Para salvar no banco, faca login.",
    };
  }

  return {
    title: "Nenhum cenario salvo ainda",
    description: "Salve uma simulacao para criar seu historico da conta.",
  };
}

export function HistoryTable({
  items,
  isAuthenticated,
  isLoading,
  onClear,
  onDelete,
  onLoad,
}: HistoryTableProps) {
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          !normalizedSearch ||
          item.observacoes.toLowerCase().includes(normalizedSearch);
        const matchesMode =
          modeFilter === "ALL" || item.input.mode === modeFilter;
        const matchesStatus =
          statusFilter === "ALL" || item.result.status === statusFilter;

        return matchesSearch && matchesMode && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "date-asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        if (sortBy === "margin-desc") {
          return b.result.margemLiquida - a.result.margemLiquida;
        }

        if (sortBy === "margin-asc") {
          return a.result.margemLiquida - b.result.margemLiquida;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, modeFilter, search, sortBy, statusFilter]);

  const emptyCopy = getEmptyCopy(isAuthenticated);

  return (
    <section id="historico" className="scroll-mt-20">
      <div className="flex flex-col gap-3 border-t border-[var(--border-soft)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Historico
          </p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {isAuthenticated ? "Historico da conta" : "Historico local"}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {isAuthenticated
              ? "Ultimos cenarios salvos no seu perfil."
              : "Ultimos cenarios salvos no cache deste navegador."}
          </p>
        </div>
        <Button
          onClick={onClear}
          disabled={isLoading || items.length === 0}
          variant="danger"
        >
          Limpar historico
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:mt-5 md:grid-cols-[1fr_180px_180px_190px]">
        <label className="block">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Buscar por observacao
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
            placeholder="Base, safra, porto..."
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Modo
          </span>
          <select
            value={modeFilter}
            onChange={(event) => setModeFilter(event.target.value as ModeFilter)}
            className="mt-2 min-h-11 w-full rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="ALL">Todos</option>
            <option value="CBOT">CBOT / Mercado internacional</option>
            <option value="BRL">Precos manuais em R$</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="mt-2 min-h-11 w-full rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="ALL">Todos</option>
            <option value="PREJUIZO">Prejuizo</option>
            <option value="APERTADA">Apertada</option>
            <option value="BOA">Boa</option>
            <option value="EXCELENTE">Excelente</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Ordenar
          </span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="mt-2 min-h-11 w-full rounded-md border border-[var(--border-soft)] bg-[var(--background-soft)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="date-desc">Data mais recente</option>
            <option value="date-asc">Data mais antiga</option>
            <option value="margin-desc">Maior margem</option>
            <option value="margin-asc">Menor margem</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 md:mt-5">
          <EmptyState
            title={emptyCopy.title}
            description={emptyCopy.description}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 md:hidden">
            {visibleItems.length === 0 ? (
              <EmptyState
                title="Nenhum resultado para os filtros"
                description="Ajuste a busca, modo, status ou ordenacao para visualizar outros cenarios."
              />
            ) : (
              visibleItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {formatDateTime(item.createdAt)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                        {getModeLabel(item.input.mode)}
                      </p>
                    </div>
                    <StatusBadge
                      status={item.result.status}
                      label={item.result.statusLabel}
                    />
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-[var(--text-secondary)]">
                    {item.observacoes || "Sem observacao"}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--border-soft)] pt-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Margem
                      </p>
                      <p className="gm-number mt-1 text-sm font-semibold text-[var(--text-primary)]">
                        {formatCurrencyBRL(item.result.margemLiquida)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        % custo
                      </p>
                      <p className="gm-number mt-1 text-sm font-semibold text-[var(--text-primary)]">
                        {formatPercent(
                          item.result.margemPercentualSobreCusto,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Soja max.
                      </p>
                      <p className="gm-number mt-1 text-sm font-semibold text-[var(--text-primary)]">
                        {formatCurrencyBRL(
                          item.result.precoMaximoSojaParaMargemZero,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => onLoad(item)}
                    >
                      Carregar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      Excluir
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-5 hidden overflow-x-auto rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] md:block">
            <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--background-soft)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Modo</th>
                <th className="px-4 py-3 font-semibold">Observacao</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Margem liquida
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  % sobre custo
                </th>
                <th className="px-4 py-3 text-right font-semibold">Soja max.</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Acao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)] text-[var(--text-secondary)]">
              {visibleItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-8" colSpan={8}>
                    <EmptyState
                      title="Nenhum resultado para os filtros"
                      description="Ajuste a busca, modo, status ou ordenacao para visualizar outros cenarios."
                    />
                  </td>
                </tr>
              ) : (
                visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-white/[0.035]"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">{getModeLabel(item.input.mode)}</td>
                    <td className="max-w-[260px] px-4 py-3">
                      <span className="line-clamp-2">
                        {item.observacoes || "Sem observacao"}
                      </span>
                    </td>
                    <td className="gm-number px-4 py-3 text-right font-semibold text-[var(--text-primary)]">
                      {formatCurrencyBRL(item.result.margemLiquida)}
                    </td>
                    <td className="gm-number px-4 py-3 text-right">
                      {formatPercent(item.result.margemPercentualSobreCusto)}
                    </td>
                    <td className="gm-number px-4 py-3 text-right">
                      {formatCurrencyBRL(
                        item.result.precoMaximoSojaParaMargemZero,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={item.result.status}
                        label={item.result.statusLabel}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="subtle" onClick={() => onLoad(item)}>
                          Carregar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
