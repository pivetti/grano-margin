import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function safeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <div className="flex min-h-screen flex-col bg-[#07130f] text-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-lg border border-white/10 bg-[#0b1712] p-6 shadow-2xl shadow-black/25">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Login
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Entrar na conta</h1>
          <div className="mt-6">
            <LoginForm nextPath={nextPath} />
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Ainda nao tem conta?{" "}
            <Link className="font-semibold text-emerald-300" href="/cadastro">
              Criar cadastro
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
