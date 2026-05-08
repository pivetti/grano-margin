-- Remove the discontinued USD_SIMPLE mode from the PostgreSQL enum.
-- This migration assumes no rows still use modo = 'USD_SIMPLE'.
CREATE TYPE "CalculationMode_new" AS ENUM ('BRL', 'CBOT');

ALTER TABLE "tb_crush_historicos"
  ALTER COLUMN "modo" TYPE "CalculationMode_new"
  USING ("modo"::text::"CalculationMode_new");

ALTER TYPE "CalculationMode" RENAME TO "CalculationMode_old";
ALTER TYPE "CalculationMode_new" RENAME TO "CalculationMode";
DROP TYPE "CalculationMode_old";
