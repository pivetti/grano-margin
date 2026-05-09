import type { CrushHistorico } from "@/generated/prisma/client";
import { normalizeCrushMarginInput } from "@/lib/calcular-crush-margin";
import type {
  CrushMarginHistoryItem,
  CrushMarginInput,
  CrushMarginResult,
} from "@/types/crush-margin";

type CrushHistoricoWithSnapshots = CrushHistorico & {
  inputSnapshot: unknown;
  resultSnapshot: unknown;
};

function asNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (value && typeof value === "object" && "toString" in value) {
    return Number(value.toString());
  }

  return 0;
}

function isCrushMarginInput(value: unknown): value is CrushMarginInput {
  if (!value || typeof value !== "object" || !("mode" in value)) {
    return false;
  }

  const input = value as { mode?: unknown };

  return input.mode === "BRL" || input.mode === "CBOT";
}

function isCrushMarginResult(value: unknown): value is CrushMarginResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "margemLiquida" in value;
}

export function serializeCrushHistorico(
  historico: CrushHistoricoWithSnapshots,
): CrushMarginHistoryItem {
  const input = normalizeCrushMarginInput(
    isCrushMarginInput(historico.inputSnapshot)
      ? historico.inputSnapshot
      : ({ mode: historico.modo } as CrushMarginInput),
  );

  const fallbackResult = {
    convertedPrices: {
      precoSojaSaca: asNumber(historico.precoSojaSaca),
      precoFareloTon: asNumber(historico.precoFareloTon),
      precoOleoTon: asNumber(historico.precoOleoTon),
    },
    receitaFarelo: asNumber(historico.receitaFarelo),
    receitaOleo: asNumber(historico.receitaOleo),
    receitaTotalDerivados: asNumber(historico.receitaTotalDerivados),
    custoTotal: asNumber(historico.custoTotal),
    margemBruta: asNumber(historico.margemBruta),
    margemLiquida: asNumber(historico.margemLiquida),
    margemPercentualSobreCusto: asNumber(
      historico.margemPercentualSobreCusto,
    ),
    precoMaximoSojaParaMargemZero: asNumber(
      historico.precoMaximoSojaParaMargemZero,
    ),
    status: historico.status,
    statusLabel: historico.statusLabel,
  } satisfies CrushMarginResult;

  return {
    id: historico.id,
    createdAt: historico.criadoEm.toISOString(),
    observacoes: historico.observacao ?? "",
    input,
    result: isCrushMarginResult(historico.resultSnapshot)
      ? historico.resultSnapshot
      : fallbackResult,
  };
}
