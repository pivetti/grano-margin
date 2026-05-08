import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/auth/DeleteAccountButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07130f] text-white">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-3xl gap-6">
          <section className="rounded-lg border border-white/10 bg-[#0b1712] p-6">
            <p className="text-sm font-semibold uppercase text-emerald-300">
              Perfil
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{user.nome}</h1>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <dt className="text-slate-400">Email</dt>
                <dd className="mt-1 font-semibold">{user.email}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <dt className="text-slate-400">Criado em</dt>
                <dd className="mt-1 font-semibold">
                  {formatDate(user.criadoEm)}
                </dd>
              </div>
            </dl>
          </section>

          <DeleteAccountButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
