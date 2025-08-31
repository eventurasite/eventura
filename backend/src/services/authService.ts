import bcrypt from "bcrypt";
import { prisma } from "../config/prismaClient";
import { Usuario } from "@prisma/client";

export interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipo: "comum" | "administrador";
  descricao: string;
  url_foto_perfil: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

/**
 * Criar novo usuário com validação de e-mail
 */
export async function registerUser(data: RegisterDTO): Promise<Usuario> {
  const existingUser = await prisma.usuario.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(data.senha, 10);

  return prisma.usuario.create({
    data: {
      ...data,
      senha: hashedPassword
    }
  });
}

/**
 * Login de usuário
 */
export async function loginUser({ email, senha }: LoginDTO): Promise<Usuario> {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Usuário não encontrado");

  const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
  if (!isPasswordValid) throw new Error("Senha incorreta");

  return usuario;
}

/**
 * Atualizar usuário
 */
export async function editUser(id_usuario: number, dados: Partial<Usuario>): Promise<Usuario> {
  let updatedData: any = { ...dados };

  if (dados.senha) {
    updatedData.senha = await bcrypt.hash(dados.senha, 10);
  }

  return prisma.usuario.update({
    where: { id_usuario },
    data: updatedData
  });
}

/**
 * Excluir usuário
 */
export async function removeUser(id_usuario: number): Promise<void> {
  await prisma.usuario.delete({ where: { id_usuario } });
}

/**
 * Buscar usuário por ID
 */
export async function findUserById(id_usuario: number): Promise<Usuario | null> {
  return prisma.usuario.findUnique({ where: { id_usuario } });
}

/**
 * Listar todos os usuários
 */
export async function findAllUsers(): Promise<Usuario[]> {
  return prisma.usuario.findMany();
}
