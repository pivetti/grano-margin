import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GranoMargin | Simulador de Crush Margin da Soja",
  description:
    "Dashboard agro-fintech para calcular margem estimada de esmagamento de soja por saca de 60 kg.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
