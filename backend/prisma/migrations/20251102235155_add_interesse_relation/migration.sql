-- CreateTable
CREATE TABLE "public"."Interesse" (
    "id_interesse" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interesse_pkey" PRIMARY KEY ("id_interesse")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interesse_id_usuario_id_evento_key" ON "public"."Interesse"("id_usuario", "id_evento");

-- AddForeignKey
ALTER TABLE "public"."Interesse" ADD CONSTRAINT "Interesse_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interesse" ADD CONSTRAINT "Interesse_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
