/*
  Warnings:

  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."StatusEvento" AS ENUM ('ativo', 'cancelado', 'encerrado');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('comum', 'administrador');

-- CreateEnum
CREATE TYPE "public"."StatusDenuncia" AS ENUM ('pendente', 'revisada', 'rejeitada');

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."TipoUsuario" NOT NULL,
ALTER COLUMN "data_modificacao" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id_evento" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "status" "public"."StatusEvento" NOT NULL DEFAULT 'ativo',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_modificacao" TIMESTAMP(3) NOT NULL,
    "id_organizador" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "public"."Curtida" (
    "id_curtida" SERIAL NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Curtida_pkey" PRIMARY KEY ("id_curtida")
);

-- CreateTable
CREATE TABLE "public"."Comentario" (
    "id_comentario" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "public"."Denuncia" (
    "id_denuncia" SERIAL NOT NULL,
    "status" "public"."StatusDenuncia" NOT NULL DEFAULT 'pendente',
    "motivo" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Denuncia_pkey" PRIMARY KEY ("id_denuncia")
);

-- CreateTable
CREATE TABLE "public"."Inscricao" (
    "id_inscricao" SERIAL NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificacoes_ativas" BOOLEAN NOT NULL DEFAULT true,
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id_inscricao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "public"."Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Curtida_id_usuario_id_evento_key" ON "public"."Curtida"("id_usuario", "id_evento");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_id_evento_id_usuario_key" ON "public"."Inscricao"("id_evento", "id_usuario");

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_id_organizador_fkey" FOREIGN KEY ("id_organizador") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "public"."Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Curtida" ADD CONSTRAINT "Curtida_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Curtida" ADD CONSTRAINT "Curtida_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentario" ADD CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentario" ADD CONSTRAINT "Comentario_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Denuncia" ADD CONSTRAINT "Denuncia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Denuncia" ADD CONSTRAINT "Denuncia_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
