export function formatCurrencyBRL(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function formatCurrencyUSD(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function formatPercent(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue) + "%";
}

export function formatNumber(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function parseNumberInput(value: string) {
  const compact = value.trim().replace(/\s/g, "").replace(/[^\d,.-]/g, "");

  if (!compact) {
    return Number.NaN;
  }

  const hasComma = compact.includes(",");
  const hasDot = compact.includes(".");
  let normalized = compact;

  if (hasComma && hasDot) {
    const lastComma = compact.lastIndexOf(",");
    const lastDot = compact.lastIndexOf(".");

    normalized =
      lastComma > lastDot
        ? compact.replace(/\./g, "").replace(",", ".")
        : compact.replace(/,/g, "");
  } else if (hasComma) {
    normalized = compact.replace(",", ".");
  } else if (hasDot) {
    const dotMatches = compact.match(/\./g);
    const dotCount = dotMatches?.length ?? 0;

    if (dotCount > 1) {
      normalized = compact.replace(/\./g, "");
    } else {
      const [beforeDot, afterDot] = compact.split(".");
      normalized =
        afterDot.length === 3 && beforeDot.length <= 3
          ? compact.replace(".", "")
          : compact;
    }
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
