import { PrismaClient, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

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

  if (!usuario.senha) {
    throw new Error("Usuário não possui senha cadastrada");
  }

  const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }

  const token = generateToken({ id: usuario.id_usuario, email: usuario.email });

  return { ...usuario, token };
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
