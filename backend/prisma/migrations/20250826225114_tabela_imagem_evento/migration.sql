/*
  Warnings:

  - Added the required column `descricao` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_foto_perfil` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "url_foto_perfil" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."ImagemEvento" (
    "id_imagem" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "ImagemEvento_pkey" PRIMARY KEY ("id_imagem")
);

-- AddForeignKey
ALTER TABLE "public"."ImagemEvento" ADD CONSTRAINT "ImagemEvento_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
