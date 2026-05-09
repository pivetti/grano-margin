export const EXTERNAL_MARKET_LINKS = {
  soybeanCbot: {
    label: "Consultar soja CBOT",
    url: "https://www.noticiasagricolas.com.br/cotacoes/soja/soja-bolsa-de-chicago-cme-group",
    description: "Fonte externa para consulta manual da soja em Chicago.",
  },
  soybeanPremiumParanagua: {
    label: "Consultar premio soja",
    url: "https://www.noticiasagricolas.com.br/cotacoes/soja/premio-soja-paranagua-pr",
    description: "Fonte externa para consulta manual do premio da soja em Paranagua.",
  },
  soybeanMealCbot: {
    label: "Consultar farelo CBOT",
    url: "https://br.investing.com/commodities/us-soybean-meal",
    description: "Fonte externa para consulta manual do farelo de soja.",
  },
  soybeanOilCbot: {
    label: "Consultar oleo CBOT",
    url: "https://br.investing.com/commodities/us-soybean-oil",
    description: "Fonte externa para consulta manual do oleo de soja.",
  },
} as const;
