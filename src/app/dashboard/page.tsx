import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CrushMarginCalculator } from "@/components/CrushMarginCalculator";
import { MetricCard } from "@/components/MetricCard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const totalHistoricos = await prisma.crushHistorico.count({
    where: { usuarioId: user.id },
  });

  return (
    <AppShell userName={user.nome} historicosCount={totalHistoricos}>
      <div className="mx-auto w-full max-w-7xl">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Historicos salvos"
            value={String(totalHistoricos)}
            helper="Cenarios vinculados ao seu perfil."
            accent="brand"
          />
          <MetricCard
            label="Modos de calculo"
            value="2"
            helper="CBOT internacional e precos manuais em R$."
            accent="info"
          />
          <MetricCard
            label="Base operacional"
            value="60 kg"
            helper="Margem estimada por saca."
            accent="soy"
          />
        </section>
      </div>

      <CrushMarginCalculator />
    </AppShell>
  );
}
