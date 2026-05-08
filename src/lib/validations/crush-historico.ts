import { z } from "zod";

const positiveNumber = z.coerce
  .number()
  .finite("Informe um numero valido.")
  .positive("O valor precisa ser maior que zero.");

const nonNegativeNumber = z.coerce
  .number()
  .finite("Informe um numero valido.")
  .nonnegative("O valor nao pode ser negativo.");

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
