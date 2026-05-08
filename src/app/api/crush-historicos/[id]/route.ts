import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { serializeCrushHistorico } from "@/lib/crush-historicos";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;
  const { id } = await context.params;

  const historico = await prisma.crushHistorico.findFirst({
    where: {
      id,
      usuarioId: user.id,
    },
  });

  if (!historico) {
    return NextResponse.json(
      { error: "Historico nao encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    historico: serializeCrushHistorico(historico),
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;
  const { id } = await context.params;

  const deleted = await prisma.crushHistorico.deleteMany({
    where: {
      id,
      usuarioId: user.id,
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json(
      { error: "Historico nao encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
