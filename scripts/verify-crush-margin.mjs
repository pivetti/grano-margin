import assert from "node:assert/strict";
import {
  calcularCrushMargin,
  convertToBrlPrices,
} from "../src/lib/calcular-crush-margin.ts";

const round = (value) => Number(value.toFixed(6));

const brlResult = calcularCrushMargin({
  mode: "BRL",
  precoSojaSaca: 127.38,
  precoFareloTon: 1670,
  precoOleoTon: 6250,
  kgFareloPorSaca: 44,
  kgOleoPorSaca: 11,
  custosOperacionaisPorSaca: 0,
});

assert.equal(round(brlResult.receitaFarelo), 73.48);
assert.equal(round(brlResult.receitaOleo), 68.75);
assert.equal(round(brlResult.receitaTotalDerivados), 142.23);
assert.equal(round(brlResult.custoTotal), 127.38);
assert.equal(round(brlResult.margemLiquida), 14.85);
assert.equal(round(brlResult.margemPercentualSobreCusto), 11.658031);
assert.equal(round(brlResult.precoMaximoSojaParaMargemZero), 142.23);
assert.equal(brlResult.status, "BOA");

const brlWithBrokerResult = calcularCrushMargin({
  mode: "BRL",
  precoSojaSaca: 127.38,
  precoFareloTon: 1670,
  precoOleoTon: 6250,
  kgFareloPorSaca: 44,
  kgOleoPorSaca: 11,
  custosOperacionaisPorSaca: 0,
  comissaoCorretorPercentual: 10,
});

assert.equal(round(brlWithBrokerResult.descontosComerciaisTotal), 14.223);
assert.equal(round(brlWithBrokerResult.custoTotal), 141.603);
assert.equal(round(brlWithBrokerResult.margemLiquida), 0.627);
assert.equal(
  round(brlWithBrokerResult.precoMaximoSojaParaMargemZero),
  128.007,
);

const cbotInput = {
  mode: "CBOT",
  cotacaoDolar: 4.9079,
  sojaUsdPorBushel: 11.77,
  premioSojaUsdPorBushel: 0,
  fareloUsdPorShortTon: 300,
  oleoCentsPorLibra: 50,
  kgFareloPorSaca: 44,
  kgOleoPorSaca: 11,
  custosOperacionaisPorSaca: 0,
};

const cbotPrices = convertToBrlPrices(cbotInput);
const cbotResult = calcularCrushMargin(cbotInput);

assert.equal(round(cbotPrices.precoSojaUsdSaca ?? 0), 25.947972);
assert.equal(round(cbotPrices.precoSojaSaca), 127.350051);
assert.equal(round(cbotPrices.sojaAjustadaUsdPorBushel ?? 0), 11.77);
assert.equal(round(cbotPrices.precoFareloUsdTon ?? 0), 330.693393);
assert.equal(round(cbotPrices.precoOleoUsdTon ?? 0), 1102.311311);
assert.equal(round(cbotResult.receitaFarelo), 71.412445);
assert.equal(round(cbotResult.receitaOleo), 59.510371);
assert.equal(round(cbotResult.margemLiquida), 3.572764);

const cbotWithCommercialCostsResult = calcularCrushMargin({
  ...cbotInput,
  freteFareloPorTon: 10,
  freteOleoPorTon: 20,
  servicosPortuariosPorTon: 30,
  taxaPortuariaPorTon: 40,
  comissaoVendedorFareloPercentual: 1,
  comissaoVendedorOleoPercentual: 2,
});

assert.equal(
  round(cbotWithCommercialCostsResult.descontosComerciais.freteFarelo),
  0.44,
);
assert.equal(
  round(cbotWithCommercialCostsResult.descontosComerciais.freteOleo),
  0.22,
);
assert.equal(
  round(cbotWithCommercialCostsResult.descontosComerciais.servicosPortuarios),
  1.65,
);
assert.equal(
  round(cbotWithCommercialCostsResult.descontosComerciais.taxaPortuaria),
  2.2,
);
assert.equal(
  round(
    cbotWithCommercialCostsResult.descontosComerciais
      .comissaoVendedorFarelo,
  ),
  0.714124,
);
assert.equal(
  round(
    cbotWithCommercialCostsResult.descontosComerciais.comissaoVendedorOleo,
  ),
  1.190207,
);
assert.equal(
  round(cbotWithCommercialCostsResult.descontosComerciaisTotal),
  6.414332,
);

const cbotWithPremiumPrices = convertToBrlPrices({
  ...cbotInput,
  premioSojaUsdPorBushel: 0.8,
});

assert.equal(round(cbotWithPremiumPrices.sojaAjustadaUsdPorBushel ?? 0), 12.57);
assert.equal(round(cbotWithPremiumPrices.precoSojaUsdSaca ?? 0), 27.71164);
assert.equal(round(cbotWithPremiumPrices.precoSojaSaca), 136.005959);

console.log("Cálculos de referência aprovados:", {
  brl: {
    receitaFarelo: brlResult.receitaFarelo,
    receitaOleo: brlResult.receitaOleo,
    receitaTotalDerivados: brlResult.receitaTotalDerivados,
    custoTotal: brlResult.custoTotal,
    margemLiquida: brlResult.margemLiquida,
    margemPercentualSobreCusto: brlResult.margemPercentualSobreCusto,
    precoMaximoSojaParaMargemZero:
      brlResult.precoMaximoSojaParaMargemZero,
    status: brlResult.status,
  },
  cbot: {
    sojaUsdSaca: cbotPrices.precoSojaUsdSaca,
    sojaAjustadaUsdBushelComPremio:
      cbotWithPremiumPrices.sojaAjustadaUsdPorBushel,
    sojaBrlSacaComPremio: cbotWithPremiumPrices.precoSojaSaca,
    fareloUsdTon: cbotPrices.precoFareloUsdTon,
    oleoUsdTon: cbotPrices.precoOleoUsdTon,
    margemLiquida: cbotResult.margemLiquida,
  },
});
