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
    console.log("E-mail de recuperação enviado:", response.statusCode);
  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error);
    if (error.response) console.error(error.response.body);
    throw new Error("Falha ao enviar e-mail de recuperação.");
  }
}
