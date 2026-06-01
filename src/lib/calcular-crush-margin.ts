export type CalculationMode = "BRL" | "CBOT";

export type BaseCrushInput = {
  kgFareloPorSaca: number;
  kgOleoPorSaca: number;
  custosOperacionaisPorSaca: number;
};

export type BrlInput = BaseCrushInput & {
  mode: "BRL";
  precoSojaSaca: number;
  precoFareloTon: number;
  precoOleoTon: number;
  /** Percentual aplicado sobre a receita bruta total dos derivados. */
  comissaoCorretorPercentual?: number;
};

export type CbotInput = BaseCrushInput & {
  mode: "CBOT";
  cotacaoDolar: number;
  sojaUsdPorBushel: number;
  premioSojaUsdPorBushel: number;
  fareloUsdPorShortTon: number;
  oleoCentsPorLibra: number;
  /** Frete do farelo em R$/tonelada, aplicado sobre o rendimento de farelo por saca. */
  freteFareloPorTon?: number;
  /** Frete do oleo em R$/tonelada, aplicado sobre o rendimento de oleo por saca. */
  freteOleoPorTon?: number;
  /** Servicos portuarios em R$/tonelada, aplicados sobre farelo + oleo. */
  servicosPortuariosPorTon?: number;
  /** Taxa portuaria em R$/tonelada, aplicada sobre farelo + oleo. */
  taxaPortuariaPorTon?: number;
  /** Percentual aplicado sobre a receita bruta do farelo. */
  comissaoVendedorFareloPercentual?: number;
  /** Percentual aplicado sobre a receita bruta do oleo. */
  comissaoVendedorOleoPercentual?: number;
};

export type CrushMarginInput = BrlInput | CbotInput;

export type ConvertedPrices = {
  precoSojaSaca: number;
  precoFareloTon: number;
  precoOleoTon: number;
  cotacaoDolar?: number;
  sojaUsdPorBushel?: number;
  premioSojaUsdPorBushel?: number;
  sojaAjustadaUsdPorBushel?: number;
  precoSojaUsdSaca?: number;
  precoFareloUsdTon?: number;
  precoOleoUsdTon?: number;
};

export type CommercialDiscounts = {
  freteFarelo: number;
  freteOleo: number;
  servicosPortuarios: number;
  taxaPortuaria: number;
  comissaoVendedorFarelo: number;
  comissaoVendedorOleo: number;
  comissaoCorretor: number;
};

const KG_POR_SACA = 60;
const KG_POR_BUSHEL_SOJA = 27.216;
const SHORT_TON_EM_TONELADA_METRICA = 0.90718474;
const KG_POR_LIBRA = 0.45359237;

function normalizeOptionalNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function percentToRate(value: unknown) {
  return normalizeOptionalNumber(value) / 100;
}

export function normalizeCrushMarginInput(
  input: CrushMarginInput,
): CrushMarginInput {
  if (input.mode !== "CBOT") {
    return {
      ...input,
      comissaoCorretorPercentual: normalizeOptionalNumber(
        input.comissaoCorretorPercentual,
      ),
    };
  }

  const legacyInput = input as CbotInput & {
    sojaCentsPorBushel?: number;
    premioSojaUsdPorBushel?: number;
  };

  const sojaUsdPorBushel =
    typeof legacyInput.sojaUsdPorBushel === "number" &&
    Number.isFinite(legacyInput.sojaUsdPorBushel)
      ? legacyInput.sojaUsdPorBushel
      : typeof legacyInput.sojaCentsPorBushel === "number" &&
          Number.isFinite(legacyInput.sojaCentsPorBushel)
        ? legacyInput.sojaCentsPorBushel / 100
        : 0;

  const premioSojaUsdPorBushel =
    typeof legacyInput.premioSojaUsdPorBushel === "number" &&
    Number.isFinite(legacyInput.premioSojaUsdPorBushel)
      ? legacyInput.premioSojaUsdPorBushel
      : 0;

  return {
    ...input,
    sojaUsdPorBushel,
    premioSojaUsdPorBushel,
    freteFareloPorTon: normalizeOptionalNumber(
      legacyInput.freteFareloPorTon,
    ),
    freteOleoPorTon: normalizeOptionalNumber(legacyInput.freteOleoPorTon),
    servicosPortuariosPorTon: normalizeOptionalNumber(
      legacyInput.servicosPortuariosPorTon,
    ),
    taxaPortuariaPorTon: normalizeOptionalNumber(
      legacyInput.taxaPortuariaPorTon,
    ),
    comissaoVendedorFareloPercentual: normalizeOptionalNumber(
      legacyInput.comissaoVendedorFareloPercentual,
    ),
    comissaoVendedorOleoPercentual: normalizeOptionalNumber(
      legacyInput.comissaoVendedorOleoPercentual,
    ),
  };
}

export type CrushMarginResult = {
  convertedPrices: ConvertedPrices;
  receitaFarelo: number;
  receitaOleo: number;
  receitaTotalDerivados: number;
  descontosComerciais: CommercialDiscounts;
  descontosComerciaisTotal: number;
  custoTotal: number;
  margemBruta: number;
  margemLiquida: number;
  margemPercentualSobreCusto: number;
  precoMaximoSojaParaMargemZero: number;
  status: "PREJUIZO" | "APERTADA" | "BOA" | "EXCELENTE";
  statusLabel: string;
};

export function convertToBrlPrices(input: CrushMarginInput): ConvertedPrices {
  const normalizedInput = normalizeCrushMarginInput(input);

  if (normalizedInput.mode === "BRL") {
    return {
      precoSojaSaca: normalizedInput.precoSojaSaca,
      precoFareloTon: normalizedInput.precoFareloTon,
      precoOleoTon: normalizedInput.precoOleoTon,
    };
  }

  const bushelsPorSaca = KG_POR_SACA / KG_POR_BUSHEL_SOJA;
  const sojaAjustadaUsdPorBushel =
    normalizedInput.sojaUsdPorBushel +
    normalizedInput.premioSojaUsdPorBushel;
  const precoSojaUsdSaca = sojaAjustadaUsdPorBushel * bushelsPorSaca;

  const precoFareloUsdTon =
    normalizedInput.fareloUsdPorShortTon / SHORT_TON_EM_TONELADA_METRICA;

  const oleoUsdPorLibra = normalizedInput.oleoCentsPorLibra / 100;
  const oleoUsdPorKg = oleoUsdPorLibra / KG_POR_LIBRA;
  const precoOleoUsdTon = oleoUsdPorKg * 1000;

  return {
    precoSojaSaca: precoSojaUsdSaca * normalizedInput.cotacaoDolar,
    precoFareloTon: precoFareloUsdTon * normalizedInput.cotacaoDolar,
    precoOleoTon: precoOleoUsdTon * normalizedInput.cotacaoDolar,
    cotacaoDolar: normalizedInput.cotacaoDolar,
    sojaUsdPorBushel: normalizedInput.sojaUsdPorBushel,
    premioSojaUsdPorBushel: normalizedInput.premioSojaUsdPorBushel,
    sojaAjustadaUsdPorBushel,
    precoSojaUsdSaca,
    precoFareloUsdTon,
    precoOleoUsdTon,
  };
}

export function calcularCrushMargin(input: CrushMarginInput): CrushMarginResult {
  const normalizedInput = normalizeCrushMarginInput(input);
  const convertedPrices = convertToBrlPrices(normalizedInput);

  const { precoSojaSaca, precoFareloTon, precoOleoTon } = convertedPrices;

  // Os derivados chegam ao calculo em R$/tonelada. Dividir kg por saca por
  // 1000 converte o rendimento de uma saca de 60 kg para tonelada metrica.
  // A soja esta em R$/saca; assim, a margem final fica sempre em R$/saca.
  const toneladasFareloPorSaca = normalizedInput.kgFareloPorSaca / 1000;
  const toneladasOleoPorSaca = normalizedInput.kgOleoPorSaca / 1000;
  const toneladasDerivadosPorSaca =
    toneladasFareloPorSaca + toneladasOleoPorSaca;

  const receitaFarelo = precoFareloTon * toneladasFareloPorSaca;
  const receitaOleo = precoOleoTon * toneladasOleoPorSaca;
  const receitaTotalDerivados = receitaFarelo + receitaOleo;

  const descontosComerciais: CommercialDiscounts =
    normalizedInput.mode === "CBOT"
      ? {
          freteFarelo:
            normalizeOptionalNumber(normalizedInput.freteFareloPorTon) *
            toneladasFareloPorSaca,
          freteOleo:
            normalizeOptionalNumber(normalizedInput.freteOleoPorTon) *
            toneladasOleoPorSaca,
          servicosPortuarios:
            normalizeOptionalNumber(
              normalizedInput.servicosPortuariosPorTon,
            ) * toneladasDerivadosPorSaca,
          taxaPortuaria:
            normalizeOptionalNumber(normalizedInput.taxaPortuariaPorTon) *
            toneladasDerivadosPorSaca,
          comissaoVendedorFarelo:
            receitaFarelo *
            percentToRate(normalizedInput.comissaoVendedorFareloPercentual),
          comissaoVendedorOleo:
            receitaOleo *
            percentToRate(normalizedInput.comissaoVendedorOleoPercentual),
          comissaoCorretor: 0,
        }
      : {
          freteFarelo: 0,
          freteOleo: 0,
          servicosPortuarios: 0,
          taxaPortuaria: 0,
          comissaoVendedorFarelo: 0,
          comissaoVendedorOleo: 0,
          comissaoCorretor:
            receitaTotalDerivados *
            percentToRate(normalizedInput.comissaoCorretorPercentual),
        };

  const descontosComerciaisTotal = Object.values(descontosComerciais).reduce(
    (total, value) => total + value,
    0,
  );
  const custoTotal =
    precoSojaSaca +
    normalizedInput.custosOperacionaisPorSaca +
    descontosComerciaisTotal;

  const margemBruta = receitaTotalDerivados - precoSojaSaca;
  const margemLiquida = receitaTotalDerivados - custoTotal;

  const margemPercentualSobreCusto =
    custoTotal > 0 ? (margemLiquida / custoTotal) * 100 : 0;

  const precoMaximoSojaParaMargemZero =
    receitaTotalDerivados -
    normalizedInput.custosOperacionaisPorSaca -
    descontosComerciaisTotal;

  let status: CrushMarginResult["status"] = "PREJUIZO";
  let statusLabel = "Prejuizo / operacao desfavoravel";

  if (margemLiquida > 25) {
    status = "EXCELENTE";
    statusLabel = "Excelente margem";
  } else if (margemLiquida > 10) {
    status = "BOA";
    statusLabel = "Boa margem";
  } else if (margemLiquida > 0) {
    status = "APERTADA";
    statusLabel = "Margem apertada";
  }

  return {
    convertedPrices,
    receitaFarelo,
    receitaOleo,
    receitaTotalDerivados,
    descontosComerciais,
    descontosComerciaisTotal,
    custoTotal,
    margemBruta,
    margemLiquida,
    margemPercentualSobreCusto,
    precoMaximoSojaParaMargemZero,
    status,
    statusLabel,
  };
}
