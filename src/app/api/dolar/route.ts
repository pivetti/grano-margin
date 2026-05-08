import { NextResponse } from "next/server";
import { getUsdBrlRate } from "@/lib/dolar";

export const revalidate = 900;

export async function GET() {
  try {
    const rate = await getUsdBrlRate();

    return NextResponse.json(rate, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        source: "MANUAL_REQUIRED",
        cotacaoCompra: null,
        cotacaoVenda: null,
        cotacaoUsada: null,
        dataHoraCotacao: null,
        message:
          "Nao foi possivel buscar a cotacao do dolar. Mantenha o preenchimento manual.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  }
}
