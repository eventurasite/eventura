import { PrismaClient, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt";
import { sendResetEmail } from "./mailService";
import {
  validateEmail,
  validateSenha,
  validatePasswordStrength,
} from "../utils/validation";

const prisma = new PrismaClient();

const userSelectData = {
  id_usuario: true,
  nome: true,
  email: true,
  tipo: true,
  url_foto_perfil: true,
  descricao: true,
  telefone: true,
};

/* -------------------------------------------------------------------------- */
/*                                REGISTER USER                               */
/* -------------------------------------------------------------------------- */
export async function registerUser(data: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  descricao?: string;
}) {
  const { nome, email, senha, telefone, descricao } = data;

  // Validações corretas (apenas dos dados de ENTRADA)
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

/* -------------------------------------------------------------------------- */
/*                                  LOGIN USER                                */
/* -------------------------------------------------------------------------- */
export async function loginUser({
  email,
  senha,
}: {
  email: string;
  senha: string;
}) {
  validateEmail(email);      // agora sim: valida apenas ENTRADA
  validateSenha(senha);      // valida apenas ENTRADA

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  // Login de usuário Google não permite senha local
  if (usuario.authProvider === "google" && !usuario.senha) {
    const err: any = new Error("Faça login com o Google");
    err.code = "GOOGLE_LOGIN";
    throw err;
  }

  // Compara a senha informada com o hash salvo
  const isPasswordValid = await bcrypt.compare(senha, usuario.senha!);

  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }

  const token = generateToken({
    id: usuario.id_usuario,
    email: usuario.email,
    tipo: usuario.tipo,
  });

  return { ...usuario, token };
}

/* -------------------------------------------------------------------------- */
/*                                FORGOT PASSWORD                              */
/* -------------------------------------------------------------------------- */
export async function forgotPassword(email: string) {
  validateEmail(email);

  const user = await prisma.usuario.findUnique({ where: { email } });

  // Não revela se existe ou não (boa prática)
  if (!user) {
    return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
  }

  const token = generateToken({
    id: user.id_usuario,
  });

  const resetLink = `${process.env.APP_URL}/resetpassword?token=${token}`;

  await sendResetEmail(user.email, user.nome, resetLink);

  return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
}

/* -------------------------------------------------------------------------- */
/*                                 RESET PASSWORD                              */
/* -------------------------------------------------------------------------- */
export async function resetPassword(token: string, password: string) {
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

/* -------------------------------------------------------------------------- */
/*                                  EDIT USER                                  */
/* -------------------------------------------------------------------------- */
export async function editUser(
  requesterId: number,
  requesterType: TipoUsuario,
  targetUserId: number,
  data: any
) {
  // Busca usuário alvo
  const currentUser = await prisma.usuario.findUnique({
    where: { id_usuario: targetUserId },
  });

  if (!currentUser) {
    throw new Error("Usuário não encontrado.");
  }

  /* ------------------- Permissão: admin pode editar qualquer um ------------------- */
  const isAdmin = requesterType === TipoUsuario.administrador;

  /* -------- Comum só pode editar ele mesmo (middleware já protege, mas reforçamos) -------- */
  if (!isAdmin && requesterId !== targetUserId) {
    throw new Error("FORBIDDEN");
  }

  /* ---------------- Bloquear mudança de e-mail para usuários Google ---------------- */
  if (
    currentUser.authProvider === "google" &&
    data.email &&
    currentUser.email !== data.email
  ) {
    throw new Error("Usuários autenticados com o Google não podem alterar o e-mail.");
  }

  // "Lista branca" de campos permitidos
  const updatableData: {
    nome?: string;
    email?: string;
    telefone?: string;
    descricao?: string;
    url_foto_perfil?: string;
    tipo?: TipoUsuario; // Admin pode alterar tipo
  } = {};

  if (data.nome) updatableData.nome = data.nome;
  if (data.email) {
    validateEmail(data.email);
    updatableData.email = data.email;
  }
  if (data.telefone !== undefined) updatableData.telefone = data.telefone;
  if (data.descricao !== undefined) updatableData.descricao = data.descricao;
  if (data.url_foto_perfil) updatableData.url_foto_perfil = data.url_foto_perfil;

  // Só admin pode alterar tipo de usuário
  if (data.tipo && isAdmin) {
    updatableData.tipo = data.tipo;
  }

  return prisma.usuario.update({
    where: { id_usuario: targetUserId },
    data: updatableData,
    select: userSelectData,
  });
}

/* -------------------------------------------------------------------------- */
/*                                DELETE USER                                 */
/* -------------------------------------------------------------------------- */
export async function removeUser(id: number) {
  return prisma.usuario.delete({ where: { id_usuario: id } });
}

/* -------------------------------------------------------------------------- */
/*                               FIND USER BY ID                               */
/* -------------------------------------------------------------------------- */
export async function findUserById(id: number) {
  return prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: userSelectData,
  });
}

/* -------------------------------------------------------------------------- */
/*                               FIND ALL USERS                                */
/* -------------------------------------------------------------------------- */
export async function findAllUsers() {
  return prisma.usuario.findMany({
    select: {
      id_usuario: true,
      nome: true,
      email: true,
      tipo: true,
      url_foto_perfil: true,
      descricao: true,
    },
  });
}
