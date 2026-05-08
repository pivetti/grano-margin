export const SESSION_COOKIE_NAME = "crush_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  userId: string;
  email: string;
  nome: string;
};

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET precisa ter pelo menos 32 caracteres.");
  }

  return new TextEncoder().encode(secret);
}
