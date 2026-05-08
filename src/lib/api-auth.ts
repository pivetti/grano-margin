import { NextResponse } from "next/server";
import { isAuthRequiredError, requireUser } from "@/lib/auth";

export async function requireApiUser() {
  try {
    return { user: await requireUser() };
  } catch (error) {
    if (isAuthRequiredError(error)) {
      return {
        response: NextResponse.json(
          { error: "Autenticacao obrigatoria." },
          { status: 401 },
        ),
      };
    }

    throw error;
  }
}
