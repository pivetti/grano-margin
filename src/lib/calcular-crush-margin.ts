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
    freteFareloPorTon: normalizeOptionalNumber(input.freteFareloPorTon),
    freteOleoPorTon: normalizeOptionalNumber(input.freteOleoPorTon),
    servicosPortuariosPorTon: normalizeOptionalNumber(
      input.servicosPortuariosPorTon,
    ),
    taxaPortuariaPorTon: normalizeOptionalNumber(input.taxaPortuariaPorTon),
    comissaoVendedorFareloPercentual: normalizeOptionalNumber(
      input.comissaoVendedorFareloPercentual,
    ),
    comissaoVendedorOleoPercentual: normalizeOptionalNumber(
      input.comissaoVendedorOleoPercentual,
    ),
  };
}

export type CrushMarginResult = {
  convertedPrices: ConvertedPrices;
  receitaFarelo: number;
  receitaOleo: number;
  receitaTotalDerivados: number;
  custoTotal: number;
  margemBruta: number;
  margemLiquida: number;
  margemPercentualSobreCusto: number;
  precoMaximoSojaParaMargemZero: number;
  status: "PREJUIZO" | "APERTADA" | "BOA" | "EXCELENTE";
  statusLabel: string;
  receitaFareloBruta?: number;
  receitaOleoBruta?: number;
  descontoFreteFarelo?: number;
  descontoFreteOleo?: number;
  descontoServicosPortuarios?: number;
  descontoTaxaPortuaria?: number;
  comissaoVendedorFarelo?: number;
  comissaoVendedorOleo?: number;
  comissaoCorretor?: number;
  descontosComerciaisTotal?: number;
};

export function convertToBrlPrices(input: CrushMarginInput): ConvertedPrices {
  if (input.mode === "BRL") {
    return {
      precoSojaSaca: input.precoSojaSaca,
      precoFareloTon: input.precoFareloTon,
      precoOleoTon: input.precoOleoTon,
    };
  }

  const bushelsPorSaca = KG_POR_SACA / KG_POR_BUSHEL_SOJA;
  const sojaAjustadaUsdPorBushel =
    input.sojaUsdPorBushel + input.premioSojaUsdPorBushel;
  const precoSojaUsdSaca = sojaAjustadaUsdPorBushel * bushelsPorSaca;

  const precoFareloUsdTon =
    input.fareloUsdPorShortTon / SHORT_TON_EM_TONELADA_METRICA;

  const oleoUsdPorLibra = input.oleoCentsPorLibra / 100;
  const oleoUsdPorKg = oleoUsdPorLibra / KG_POR_LIBRA;
  const precoOleoUsdTon = oleoUsdPorKg * 1000;

  return {
    precoSojaSaca: precoSojaUsdSaca * input.cotacaoDolar,
    precoFareloTon: precoFareloUsdTon * input.cotacaoDolar,
    precoOleoTon: precoOleoUsdTon * input.cotacaoDolar,
    cotacaoDolar: input.cotacaoDolar,
    sojaUsdPorBushel: input.sojaUsdPorBushel,
    premioSojaUsdPorBushel: input.premioSojaUsdPorBushel,
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

  let descontoFreteFarelo = 0;
  let descontoFreteOleo = 0;
  let descontoServicosPortuarios = 0;
  let descontoTaxaPortuaria = 0;
  let comissaoVendedorFarelo = 0;
  let comissaoVendedorOleo = 0;
  let comissaoCorretor = 0;

  if (normalizedInput.mode === "CBOT") {
    descontoFreteFarelo =
      normalizeOptionalNumber(normalizedInput.freteFareloPorTon) *
      toneladasFareloPorSaca;
    descontoFreteOleo =
      normalizeOptionalNumber(normalizedInput.freteOleoPorTon) *
      toneladasOleoPorSaca;
    descontoServicosPortuarios =
      normalizeOptionalNumber(normalizedInput.servicosPortuariosPorTon) *
      toneladasDerivadosPorSaca;
    descontoTaxaPortuaria =
      normalizeOptionalNumber(normalizedInput.taxaPortuariaPorTon) *
      toneladasDerivadosPorSaca;
    comissaoVendedorFarelo =
      receitaFarelo * percentToRate(normalizedInput.comissaoVendedorFareloPercentual);
    comissaoVendedorOleo =
      receitaOleo * percentToRate(normalizedInput.comissaoVendedorOleoPercentual);
  } else {
    comissaoCorretor =
      (receitaFarelo + receitaOleo) *
      percentToRate(normalizedInput.comissaoCorretorPercentual);
  }

  const descontosComerciaisTotal =
    descontoFreteFarelo +
    descontoFreteOleo +
    descontoServicosPortuarios +
    descontoTaxaPortuaria +
    comissaoVendedorFarelo +
    comissaoVendedorOleo +
    comissaoCorretor;

  const receitaTotalDerivados = receitaFarelo + receitaOleo;
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
  let statusLabel = "Prejuízo / operação desfavorável";

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
    custoTotal,
    margemBruta,
    margemLiquida,
    margemPercentualSobreCusto,
    precoMaximoSojaParaMargemZero,
    status,
    statusLabel,
    receitaFareloBruta: receitaFarelo,
    receitaOleoBruta: receitaOleo,
    descontoFreteFarelo,
    descontoFreteOleo,
    descontoServicosPortuarios,
    descontoTaxaPortuaria,
    comissaoVendedorFarelo,
    comissaoVendedorOleo,
    comissaoCorretor,
    descontosComerciaisTotal,
  };
}
