import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { clearSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE() {
  const auth = await requireApiUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { user } = auth;

  await prisma.usuario.delete({
    where: { id: user.id },
  });

  await clearSession();

  return NextResponse.json({ ok: true });
}
