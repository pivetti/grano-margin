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
};

export type CbotInput = BaseCrushInput & {
  mode: "CBOT";
  cotacaoDolar: number;
  sojaUsdPorBushel: number;
  premioSojaUsdPorBushel: number;
  fareloUsdPorShortTon: number;
  oleoCentsPorLibra: number;
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

export function normalizeCrushMarginInput(
  input: CrushMarginInput,
): CrushMarginInput {
  if (input.mode !== "CBOT") {
    return input;
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
  const convertedPrices = convertToBrlPrices(input);

  const { precoSojaSaca, precoFareloTon, precoOleoTon } = convertedPrices;

  // Os derivados chegam ao calculo em R$/tonelada. Dividir kg por saca por
  // 1000 converte o rendimento de uma saca de 60 kg para tonelada metrica.
  // A soja esta em R$/saca; assim, a margem final fica sempre em R$/saca.
  const receitaFarelo = precoFareloTon * (input.kgFareloPorSaca / 1000);
  const receitaOleo = precoOleoTon * (input.kgOleoPorSaca / 1000);

  const receitaTotalDerivados = receitaFarelo + receitaOleo;
  const custoTotal = precoSojaSaca + input.custosOperacionaisPorSaca;

  const margemBruta = receitaTotalDerivados - precoSojaSaca;
  const margemLiquida = receitaTotalDerivados - custoTotal;

  const margemPercentualSobreCusto =
    custoTotal > 0 ? (margemLiquida / custoTotal) * 100 : 0;

  const precoMaximoSojaParaMargemZero =
    receitaTotalDerivados - input.custosOperacionaisPorSaca;

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
  };
}
