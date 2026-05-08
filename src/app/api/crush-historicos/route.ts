import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { calcularCrushMargin } from "@/lib/calcular-crush-margin";
import { requireApiUser } from "@/lib/api-auth";
import { serializeCrushHistorico } from "@/lib/crush-historicos";
import { prisma } from "@/lib/prisma";
import { createCrushHistoricoSchema } from "@/lib/validations/crush-historico";
import type { CrushMarginInput } from "@/types/crush-margin";

export const runtime = "nodejs";

function decimal(value: number) {
  return new Prisma.Decimal(value.toFixed(4));
}

function jsonSnapshot(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function GET() {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;

  const historicos = await prisma.crushHistorico.findMany({
    where: { usuarioId: user.id },
    orderBy: { criadoEm: "desc" },
    take: 50,
  });

  return NextResponse.json({
    historicos: historicos.map(serializeCrushHistorico),
  });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;
  const body = await request.json().catch(() => null);
  const parsed = createCrushHistoricoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados invalidos.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data.input as CrushMarginInput;
  const result = calcularCrushMargin(input);
  const observacao = parsed.data.observacao || null;

  const historico = await prisma.crushHistorico.create({
    data: {
      usuarioId: user.id,
      modo: input.mode,
      observacao,
      precoSojaSaca: decimal(result.convertedPrices.precoSojaSaca),
      precoFareloTon: decimal(result.convertedPrices.precoFareloTon),
      precoOleoTon: decimal(result.convertedPrices.precoOleoTon),
      kgFareloPorSaca: decimal(input.kgFareloPorSaca),
      kgOleoPorSaca: decimal(input.kgOleoPorSaca),
      custosOperacionaisPorSaca: decimal(input.custosOperacionaisPorSaca),
      receitaFarelo: decimal(result.receitaFarelo),
      receitaOleo: decimal(result.receitaOleo),
      receitaTotalDerivados: decimal(result.receitaTotalDerivados),
      custoTotal: decimal(result.custoTotal),
      margemBruta: decimal(result.margemBruta),
      margemLiquida: decimal(result.margemLiquida),
      margemPercentualSobreCusto: decimal(
        result.margemPercentualSobreCusto,
      ),
      precoMaximoSojaParaMargemZero: decimal(
        result.precoMaximoSojaParaMargemZero,
      ),
      status: result.status,
      statusLabel: result.statusLabel,
      inputSnapshot: jsonSnapshot(input),
      convertedPricesSnapshot: jsonSnapshot(result.convertedPrices),
      resultSnapshot: jsonSnapshot(result),
    },
  });

  return NextResponse.json(
    { historico: serializeCrushHistorico(historico) },
    { status: 201 },
  );
}

export async function DELETE() {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;

  await prisma.crushHistorico.deleteMany({
    where: { usuarioId: user.id },
  });

  return NextResponse.json({ ok: true });
}
