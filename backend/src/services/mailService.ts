import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Envia o e-mail de recuperação de senha
 */
export async function sendResetEmail(to: string, nome: string, link: string) {
  try {
    const msg = {
      to,
      from: {
        name: "Eventura",
        email: process.env.MAIL_FROM!,
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID_PASSWORD!, // TEMPLATE RESET
      dynamicTemplateData: {
        nome,
        link,
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
 * Envia e-mails com templates dinâmicos do SendGrid
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
    console.log("Email de recuperação de senha enviado:", response.statusCode);
  } catch (error: any) {
    console.error("Erro ao enviar email de recuperação de senha:", error);
    if (error.response) console.error(error.response.body);
    throw new Error("Falha ao enviar email de recuperação de senha.");
  }
}

/* -------------------------------------------------------------------------- */
/* Envio do e-mail de confirmação de e-mail     */
/* -------------------------------------------------------------------------- */
export async function sendEmailVerification(to: string, nome: string, link: string) {
  try {
    const msg = {
      to,
      from: {
        name: "Eventura",
        email: process.env.MAIL_FROM!,
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID_VERIFY_EMAIL!, 
      dynamicTemplateData: {
        nome,
        link,
      },
    };

    const [response] = await sgMail.send(msg);
    console.log("Email de verificação enviado:", response.statusCode);
  } catch (error: any) {
    console.error("Erro ao enviar email de verificação:", error);
    if (error.response) console.error(error.response.body);
    throw new Error("Falha ao enviar e-mail de verificação.");
  }
}
