import type { ConvertedPrices } from "@/lib/calcular-crush-margin";
import { formatCurrencyBRL, formatCurrencyUSD } from "@/lib/formatters";
import { MetricCard } from "./MetricCard";

type ConversionPreviewProps = {
  prices: ConvertedPrices;
  showUsd: boolean;
};

export function ConversionPreview({ prices, showUsd }: ConversionPreviewProps) {
  return (
    <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--background-soft)] p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Conversao
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)]">
            Precos normalizados para R$/saca e R$/tonelada
          </h3>
        </div>
      </div>
      {showUsd ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Soja CBOT original"
            value={formatCurrencyUSD(prices.sojaUsdPorBushel ?? 0)}
            helper="US$/bushel"
            accent="info"
          />
          <MetricCard
            label="Premio da soja"
            value={formatCurrencyUSD(prices.premioSojaUsdPorBushel ?? 0)}
            helper="US$/bushel"
            accent="info"
          />
          <MetricCard
            label="Soja ajustada"
            value={formatCurrencyUSD(prices.sojaAjustadaUsdPorBushel ?? 0)}
            helper="US$/bushel"
            accent="info"
          />
          <MetricCard
            label="Dolar utilizado"
            value={formatCurrencyBRL(prices.cotacaoDolar ?? 0)}
            helper="R$/US$"
            accent="info"
          />
        </div>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Soja convertida"
          value={formatCurrencyBRL(prices.precoSojaSaca)}
          helper="R$/saca"
          accent="soy"
        />
        <MetricCard
          label="Farelo convertido"
          value={formatCurrencyBRL(prices.precoFareloTon)}
          helper="R$/ton"
          accent="meal"
        />
        <MetricCard
          label="Oleo convertido"
          value={formatCurrencyBRL(prices.precoOleoTon)}
          helper="R$/ton"
          accent="oil"
        />
      </div>
      {showUsd ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label="Soja em USD"
            value={formatCurrencyUSD(prices.precoSojaUsdSaca ?? 0)}
            helper="US$/saca ajustado"
            accent="info"
          />
          <MetricCard
            label="Farelo em USD"
            value={formatCurrencyUSD(prices.precoFareloUsdTon ?? 0)}
            helper="US$/ton metrico derivado do short ton"
            accent="info"
          />
          <MetricCard
            label="Oleo em USD"
            value={formatCurrencyUSD(prices.precoOleoUsdTon ?? 0)}
            helper="US$/ton metrico derivado de US¢/libra"
            accent="info"
          />
        </div>
      ) : null}
    </section>
  );
}
