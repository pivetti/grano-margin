import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

const invalidCredentialsResponse = () =>
  NextResponse.json({ error: "Email ou senha invalidos." }, { status: 401 });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados invalidos.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const user = await prisma.usuario.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      nome: true,
      email: true,
      senhaHash: true,
      criadoEm: true,
    },
  });

  if (!user) {
    return invalidCredentialsResponse();
  }

  const validPassword = await verifyPassword(
    parsed.data.senha,
    user.senhaHash,
  );

  if (!validPassword) {
    return invalidCredentialsResponse();
  }

  await createSession({
    userId: user.id,
    email: user.email,
    nome: user.nome,
  });

  return NextResponse.json({
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      criadoEm: user.criadoEm.toISOString(),
    },
  });
}
