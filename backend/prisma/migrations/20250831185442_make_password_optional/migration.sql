-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT 'local',
ALTER COLUMN "senha" DROP NOT NULL,
ALTER COLUMN "tipo" SET DEFAULT 'comum',
ALTER COLUMN "telefone" DROP NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "url_foto_perfil" DROP NOT NULL;
