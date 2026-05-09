import { z } from "zod";

const finiteNumber = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? NaN : value),
  z.coerce.number().finite("Informe um numero valido."),
);

const positiveNumber = finiteNumber.refine(
  (value) => value > 0,
  "O valor precisa ser maior que zero.",
);

const nonNegativeNumber = finiteNumber.refine(
  (value) => value >= 0,
  "O valor nao pode ser negativo.",
);

const baseInputSchema = {
  kgFareloPorSaca: positiveNumber,
  kgOleoPorSaca: positiveNumber,
  custosOperacionaisPorSaca: nonNegativeNumber,
};

export const crushMarginInputSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("BRL"),
    ...baseInputSchema,
    precoSojaSaca: nonNegativeNumber,
    precoFareloTon: nonNegativeNumber,
    precoOleoTon: nonNegativeNumber,
  }),
  z.object({
    mode: z.literal("CBOT"),
    ...baseInputSchema,
    cotacaoDolar: positiveNumber,
    sojaUsdPorBushel: nonNegativeNumber,
    premioSojaUsdPorBushel: finiteNumber.default(0),
    fareloUsdPorShortTon: nonNegativeNumber,
    oleoCentsPorLibra: nonNegativeNumber,
  }),
]);

export const createCrushHistoricoSchema = z.object({
  observacao: z
    .string()
    .trim()
    .max(255, "A observacao pode ter no maximo 255 caracteres.")
    .optional()
    .default(""),
  input: crushMarginInputSchema,
});

export type CreateCrushHistoricoInput = z.infer<
  typeof createCrushHistoricoSchema
>;
