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

const cbotInput = {
  mode: "CBOT",
  cotacaoDolar: 4.9079,
  sojaUsdPorBushel: 11.77,
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
assert.equal(round(cbotPrices.precoFareloUsdTon ?? 0), 330.693393);
assert.equal(round(cbotPrices.precoOleoUsdTon ?? 0), 1102.311311);
assert.equal(round(cbotResult.receitaFarelo), 71.412445);
assert.equal(round(cbotResult.receitaOleo), 59.510371);
assert.equal(round(cbotResult.margemLiquida), 3.572764);

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
    fareloUsdTon: cbotPrices.precoFareloUsdTon,
    oleoUsdTon: cbotPrices.precoOleoUsdTon,
    margemLiquida: cbotResult.margemLiquida,
  },
});
