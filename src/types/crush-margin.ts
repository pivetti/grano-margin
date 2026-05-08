import type {
  CalculationMode,
  CrushMarginInput,
  CrushMarginResult,
} from "@/lib/calcular-crush-margin";

export type { CalculationMode, CrushMarginInput, CrushMarginResult };

export type CrushMarginHistoryItem = {
  id: string;
  createdAt: string;
  observacoes: string;
  input: CrushMarginInput;
  result: CrushMarginResult;
};
