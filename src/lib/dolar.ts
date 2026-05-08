export type DolarSource = "BCB_PTAX" | "AWESOME_API" | "MANUAL_REQUIRED";

export type UsdBrlRateResponse = {
  success: boolean;
  source: DolarSource;
  cotacaoCompra: number | null;
  cotacaoVenda: number | null;
  cotacaoUsada: number | null;
  dataHoraCotacao: string | null;
  message: string;
};

type BcbPtaxItem = {
  cotacaoCompra?: unknown;
  cotacaoVenda?: unknown;
  dataHoraCotacao?: unknown;
  tipoBoletim?: unknown;
};

type BcbPtaxResponse = {
  value?: unknown;
};

type AwesomeApiResponse = {
  USDBRL?: {
    bid?: unknown;
    ask?: unknown;
    create_date?: unknown;
  };
};

const BCB_PTAX_BASE_URL =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata";
const AWESOME_API_URL = "https://economia.awesomeapi.com.br/last/USD-BRL";
const FETCH_REVALIDATE_SECONDS = 15 * 60;
const FETCH_TIMEOUT_MS = 5_000;

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toStringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function formatBcbDate(date: Date) {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}-${day}-${year}`;
}

function getBrazilTodayUtcNoon() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(Date.UTC(year, month - 1, day, 12));
}

function subtractDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() - days);

  return nextDate;
}

function createManualRequired(message: string): UsdBrlRateResponse {
  return {
    success: false,
    source: "MANUAL_REQUIRED",
    cotacaoCompra: null,
    cotacaoVenda: null,
    cotacaoUsada: null,
    dataHoraCotacao: null,
    message,
  };
}

function pickLatestBcbQuote(items: BcbPtaxItem[]) {
  const validItems = items
    .map((item) => ({
      cotacaoCompra: toNumber(item.cotacaoCompra),
      cotacaoVenda: toNumber(item.cotacaoVenda),
      dataHoraCotacao: toStringOrNull(item.dataHoraCotacao),
      tipoBoletim: toStringOrNull(item.tipoBoletim),
    }))
    .filter((item) => item.cotacaoCompra !== null && item.cotacaoVenda !== null)
    .sort((a, b) => {
      const aTime = a.dataHoraCotacao
        ? new Date(a.dataHoraCotacao).getTime()
        : 0;
      const bTime = b.dataHoraCotacao
        ? new Date(b.dataHoraCotacao).getTime()
        : 0;

      return bTime - aTime;
    });

  return (
    validItems.find((item) => item.tipoBoletim === "Fechamento") ??
    validItems[0] ??
    null
  );
}

export async function fetchBcbPtax(): Promise<UsdBrlRateResponse> {
  const today = getBrazilTodayUtcNoon();

  for (let offset = 0; offset < 7; offset += 1) {
    const date = subtractDays(today, offset);
    const bcbDate = formatBcbDate(date);
    const url = `${BCB_PTAX_BASE_URL}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='${bcbDate}'&$top=100&$format=json`;

    try {
      const response = await fetch(url, {
        next: { revalidate: FETCH_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json().catch(() => null)) as
        | BcbPtaxResponse
        | null;
      const values = Array.isArray(data?.value)
        ? (data.value as BcbPtaxItem[])
        : [];
      const quote = pickLatestBcbQuote(values);

      if (quote?.cotacaoVenda !== null && quote?.cotacaoCompra !== null) {
        return {
          success: true,
          source: "BCB_PTAX",
          cotacaoCompra: quote.cotacaoCompra,
          cotacaoVenda: quote.cotacaoVenda,
          cotacaoUsada: quote.cotacaoVenda,
          dataHoraCotacao: quote.dataHoraCotacao,
          message: "Cotacao carregada pelo Banco Central PTAX.",
        };
      }
    } catch {
      continue;
    }
  }

  return createManualRequired(
    "Banco Central PTAX nao retornou cotacao valida nos ultimos 7 dias.",
  );
}

export async function fetchAwesomeUsdBrl(): Promise<UsdBrlRateResponse> {
  try {
    const response = await fetch(AWESOME_API_URL, {
      next: { revalidate: FETCH_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return createManualRequired("AwesomeAPI nao respondeu com sucesso.");
    }

    const data = (await response.json().catch(() => null)) as
      | AwesomeApiResponse
      | null;
    const usdBrl = data?.USDBRL;
    const cotacaoCompra = toNumber(usdBrl?.bid);
    const cotacaoVenda = toNumber(usdBrl?.ask);

    if (cotacaoCompra === null || cotacaoVenda === null) {
      return createManualRequired("AwesomeAPI nao retornou cotacao valida.");
    }

    return {
      success: true,
      source: "AWESOME_API",
      cotacaoCompra,
      cotacaoVenda,
      cotacaoUsada: cotacaoVenda,
      dataHoraCotacao: toStringOrNull(usdBrl?.create_date),
      message: "Cotacao carregada pela AwesomeAPI.",
    };
  } catch {
    return createManualRequired("Falha ao consultar AwesomeAPI.");
  }
}

export async function getUsdBrlRate(): Promise<UsdBrlRateResponse> {
  const bcbRate = await fetchBcbPtax();

  if (bcbRate.success) {
    return bcbRate;
  }

  const awesomeRate = await fetchAwesomeUsdBrl();

  if (awesomeRate.success) {
    return awesomeRate;
  }

  return createManualRequired(
    "Nao foi possivel buscar a cotacao do dolar. Mantenha o preenchimento manual.",
  );
}
