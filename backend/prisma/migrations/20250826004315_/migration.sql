/*
  Warnings:

  - You are about to drop the column `status` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `telefone` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "status",
ADD COLUMN     "telefone" TEXT NOT NULL;
