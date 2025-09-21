import { PrismaClient, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt";
import { sendResetEmail } from "./mailService";

const prisma = new PrismaClient();

import { validateEmail, validateSenha,validatePasswordStrength } from "../utils/validation";
/**
 * Criar usuário local
 */
export async function registerUser(data: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  descricao?: string;
}) {
  const { nome, email, senha, telefone, descricao } = data;

  validateEmail(email);
  validateSenha(senha);
  validatePasswordStrength(senha);

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    if (existing.authProvider === "google") {
      throw new Error("E-mail já cadastrado via Google");
    }
    throw new Error("E-mail já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  return prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      telefone: telefone || "",
      descricao: descricao || "",
      tipo: TipoUsuario.comum,
      authProvider: "local",
    },
  });
}

/**
 * Login usuário local
 */
export async function loginUser({
  email,
  senha,
}: {
  email: string;
  senha: string;
}) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  if (usuario.authProvider === "google" && !usuario.senha) {
    const err: any = new Error("Faça login com o Google");
    err.code = "GOOGLE_LOGIN";
    throw err;
  }

  validateEmail(usuario.email);
  validateSenha(usuario.senha);

const isPasswordValid = await bcrypt.compare(senha, usuario.senha!); 
if (!isPasswordValid) {
  throw new Error("Senha incorreta");
}


  const token = generateToken({ id: usuario.id_usuario, email: usuario.email });

  return { ...usuario, token };
}

export async function forgotPassword(email: string) {
  validateEmail(email);

  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
  }

  const token = generateToken({ id: user.id_usuario });
  const resetLink = `${process.env.APP_URL}/resetpassword?token=${token}`;

  // agora dispara o e-mail
  await sendResetEmail(user.email, resetLink);

  return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
}

export async function resetPassword(token: string, password: string) {
  // validações
  validateSenha(password);
  validatePasswordStrength(password);

  if (!token) throw new Error("Token não informado");

  let payload: any;
  try {
    payload = verifyToken(token);
  } catch {
    throw new Error("Token inválido ou expirado");
  }

  const user = await prisma.usuario.findUnique({
    where: { id_usuario: payload.id },
  });

  if (!user) throw new Error("Usuário não encontrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.usuario.update({
    where: { id_usuario: user.id_usuario },
    data: { senha: hashedPassword },
  });

  return { message: "Senha redefinida com sucesso" };
}

/**
 * Atualizar usuário
 */
export async function editUser(id: number, data: any) {
  return prisma.usuario.update({ where: { id_usuario: id }, data });
}

/**
 * Excluir usuário
 */
export async function removeUser(id: number) {
  return prisma.usuario.delete({ where: { id_usuario: id } });
}

/**
 * Buscar usuário por ID
 */
export async function findUserById(id: number) {
  return prisma.usuario.findUnique({ where: { id_usuario: id } });
}

/**
 * Listar todos os usuários
 */
export async function findAllUsers() {
  return prisma.usuario.findMany();
}
