import { PrismaClient } from "@prisma/client";
import { subDays, isSameDay } from "date-fns";
import dotenv from "dotenv";
import { sendTemplateEmail } from "./mailService";

dotenv.config();
const prisma = new PrismaClient();

/**
 * Serviço de lembretes automáticos
 * Envia e-mails para usuários que marcaram interesse em eventos,
 * 7 dias e 1 dia antes da data do evento.
 */
export async function sendEventReminders() {
  const today = new Date();

  const eventos = await prisma.evento.findMany({
    where: { data: { gt: today }, status: "ativo" },
    include: {
      interesses: { include: { usuario: true } },
    },
  });

  for (const evento of eventos) {
    const eventDate = new Date(evento.data);
    const sevenDaysBefore = subDays(eventDate, 7);
    const oneDayBefore = subDays(eventDate, 1);

    // Envia apenas se hoje for 7 ou 1 dia antes do evento
    if (isSameDay(today, sevenDaysBefore) || isSameDay(today, oneDayBefore)) {
      const daysLeft = isSameDay(today, sevenDaysBefore) ? 7 : 1;

      for (const interesse of evento.interesses) {
        const user = interesse.usuario;
        if (!user?.email) continue;

        // Formata data e hora para o e-mail
        const dataFormatada = `${eventDate.toLocaleDateString("pt-BR")} às ${eventDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        // Envio com template dinâmico do SendGrid
        await sendTemplateEmail({
          to: user.email,
          templateId: process.env.SENDGRID_TEMPLATE_ID_REMINDER!,
          dynamicTemplateData: {
            nome: user.nome,
            evento: evento.titulo,
            data: dataFormatada,
            local: evento.local,
            dias_restantes: daysLeft,
            dias_restantes_7: daysLeft === 7,
          },
        });

        console.log(
          `[EMAIL] Lembrete enviado (${daysLeft} dias antes) → ${user.email}`
        );
      }
    }
  }
}
