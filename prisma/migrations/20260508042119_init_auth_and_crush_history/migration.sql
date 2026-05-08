-- CreateEnum
CREATE TYPE "CalculationMode" AS ENUM ('BRL', 'USD_SIMPLE', 'CBOT');

-- CreateEnum
CREATE TYPE "CrushStatus" AS ENUM ('PREJUIZO', 'APERTADA', 'BOA', 'EXCELENTE');

-- CreateTable
CREATE TABLE "tb_usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_crush_historicos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "modo" "CalculationMode" NOT NULL,
    "observacao" VARCHAR(255),
    "preco_soja_saca" DECIMAL(14,4) NOT NULL,
    "preco_farelo_ton" DECIMAL(14,4) NOT NULL,
    "preco_oleo_ton" DECIMAL(14,4) NOT NULL,
    "kg_farelo_por_saca" DECIMAL(10,4) NOT NULL,
    "kg_oleo_por_saca" DECIMAL(10,4) NOT NULL,
    "custos_operacionais_por_saca" DECIMAL(14,4) NOT NULL,
    "receita_farelo" DECIMAL(14,4) NOT NULL,
    "receita_oleo" DECIMAL(14,4) NOT NULL,
    "receita_total_derivados" DECIMAL(14,4) NOT NULL,
    "custo_total" DECIMAL(14,4) NOT NULL,
    "margem_bruta" DECIMAL(14,4) NOT NULL,
    "margem_liquida" DECIMAL(14,4) NOT NULL,
    "margem_percentual_sobre_custo" DECIMAL(10,4) NOT NULL,
    "preco_maximo_soja_para_margem_zero" DECIMAL(14,4) NOT NULL,
    "status" "CrushStatus" NOT NULL,
    "status_label" VARCHAR(80) NOT NULL,
    "input_snapshot" JSONB NOT NULL,
    "converted_prices_snapshot" JSONB NOT NULL,
    "result_snapshot" JSONB NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_crush_historicos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_email_key" ON "tb_usuarios"("email");

-- CreateIndex
CREATE INDEX "tb_crush_historicos_usuario_id_idx" ON "tb_crush_historicos"("usuario_id");

-- CreateIndex
CREATE INDEX "tb_crush_historicos_usuario_id_criado_em_idx" ON "tb_crush_historicos"("usuario_id", "criado_em" DESC);

-- CreateIndex
CREATE INDEX "tb_crush_historicos_usuario_id_modo_idx" ON "tb_crush_historicos"("usuario_id", "modo");

-- CreateIndex
CREATE INDEX "tb_crush_historicos_usuario_id_margem_liquida_idx" ON "tb_crush_historicos"("usuario_id", "margem_liquida");

-- CreateIndex
CREATE INDEX "tb_crush_historicos_usuario_id_status_idx" ON "tb_crush_historicos"("usuario_id", "status");

-- AddForeignKey
ALTER TABLE "tb_crush_historicos" ADD CONSTRAINT "tb_crush_historicos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
