import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

export default async function CadastroPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07130f] text-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#0b1712] p-6 shadow-2xl shadow-black/25">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Cadastro
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Criar conta</h1>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Ja tem conta?{" "}
            <Link className="font-semibold text-emerald-300" href="/login">
              Entrar
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
