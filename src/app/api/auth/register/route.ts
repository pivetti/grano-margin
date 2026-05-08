import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados invalidos.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { nome, email, senha } = parsed.data;

  const existingUser = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Ja existe uma conta com este email." },
      { status: 409 },
    );
  }

  const senhaHash = await hashPassword(senha);
  const user = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    nome: user.nome,
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        criadoEm: user.criadoEm.toISOString(),
      },
    },
    { status: 201 },
  );
}
