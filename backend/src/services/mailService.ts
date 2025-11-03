import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Envia o e-mail de recuperação de senha usando o template visual do SendGrid
 */
export async function sendResetEmail(to: string, nome: string, link: string) {
  try {
    const msg = {
      to, // destinatário
      from: {
        name: "Eventura",
        email: process.env.MAIL_FROM!, // remetente verificado no SendGrid
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID!, // ID do template criado no SendGrid
      dynamicTemplateData: {
        nome, // variável usada no template ({{nome}})
        link, // variável usada no template ({{link}})
      },
    };

    const [response] = await sgMail.send(msg);
    console.log("Email de recuperação enviado:", response.statusCode);
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    if (error.response) console.error(error.response.body);
    throw new Error("Falha ao enviar email de recuperação.");
  }
}

/**
 * Envia e-mails com templates dinâmicos do SendGrid (ex: lembretes de eventos)
 */
export async function sendTemplateEmail({
  to,
  templateId,
  dynamicTemplateData,
}: {
  to: string;
  templateId: string;
  dynamicTemplateData: Record<string, any>;
}) {
  try {
    const msg = {
      to,
      from: {
        name: "Eventura",
        email: process.env.MAIL_FROM!,
      },
      templateId,
      dynamicTemplateData,
    };

    const [response] = await sgMail.send(msg);
    console.log(`Email enviado para ${to} (${response.statusCode})`);
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    if (error.response) console.error(error.response.body);
    throw new Error("Falha ao enviar email via SendGrid.");
  }
}
