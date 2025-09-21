import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com", // ou seu provedor
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true se porta 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendResetEmail(to: string, link: string) {
  const info = await transporter.sendMail({
    from: `"Eventura" <${process.env.MAIL_USER}>`,
    to,
    subject: "Redefinição de senha - Eventura",
    html: `
      <p>Você solicitou a redefinição da sua senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <p><a href="${link}" target="_blank">${link}</a></p>
      <p>Se não foi você, ignore este e-mail.</p>
    `,
  });

  console.log("E-mail de recuperação enviado:", info.messageId);
}
