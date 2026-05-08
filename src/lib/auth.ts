import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import {
  getAuthSecret,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  type SessionUser,
} from "@/lib/session";

export type CurrentUser = {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
};

export class AuthRequiredError extends Error {
  constructor() {
    super("Usuario nao autenticado.");
    this.name = "AuthRequiredError";
  }
}

export function isAuthRequiredError(error: unknown) {
  return error instanceof AuthRequiredError;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const userId = payload.userId;
    const email = payload.email;
    const nome = payload.nome;

    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      typeof nome !== "string"
    ) {
      return null;
    }

    return { userId, email, nome };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.usuario.findUnique({
    where: { id: sessionUser.userId },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    criadoEm: user.criadoEm.toISOString(),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
