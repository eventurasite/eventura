/*
  Warnings:

  - You are about to drop the `Inscricao` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_evento,id_usuario]` on the table `Interesse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Inscricao" DROP CONSTRAINT "Inscricao_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscricao" DROP CONSTRAINT "Inscricao_id_usuario_fkey";

-- DropIndex
DROP INDEX "public"."Interesse_id_usuario_id_evento_key";

-- AlterTable
ALTER TABLE "public"."Interesse" ADD COLUMN     "notificacoes_ativas" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "public"."Inscricao";

-- CreateIndex
CREATE UNIQUE INDEX "Interesse_id_evento_id_usuario_key" ON "public"."Interesse"("id_evento", "id_usuario");
