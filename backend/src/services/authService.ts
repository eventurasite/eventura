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

/**
 * Esqueci minha senha
 */
export async function forgotPassword(email: string) {
  validateEmail(email);

  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
  }

  const token = generateToken({ id: user.id_usuario });
  const resetLink = `${process.env.APP_URL}/resetpassword?token=${token}`;

  await sendResetEmail(user.email, user.nome, resetLink);

  return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
}


/**
 * Redefinir senha
 */
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

/**
 * Atualizar usuário
 */
export async function editUser(id: number, data: any) {
  // 1. Busca o estado atual do usuário no banco.
  const currentUser = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });

  if (!currentUser) {
    throw new Error("Usuário não encontrado.");
  }

  // 2. REGRA DE NEGÓCIO: Impede que usuários Google alterem o e-mail.
  if (currentUser.authProvider === 'google' && data.email && currentUser.email !== data.email) {
    throw new Error("Usuários autenticados com o Google não podem alterar o endereço de e-mail.");
  }

  // 3. "LISTA BRANCA": Define quais campos são seguros para atualização.
  const updatableData: {
    nome?: string;
    email?: string;
    telefone?: string;
    descricao?: string;
    url_foto_perfil?: string;
  } = {};

  // 4. Preenche o objeto apenas com os dados permitidos que vieram na requisição.
  if (data.nome) updatableData.nome = data.nome;
  if (data.email) updatableData.email = data.email;
  if (typeof data.telefone !== "undefined")
    updatableData.telefone = data.telefone;
  if (typeof data.descricao !== "undefined")
    updatableData.descricao = data.descricao;
  if (data.url_foto_perfil)
    updatableData.url_foto_perfil = data.url_foto_perfil;

  // 5. Envia ao Prisma apenas os dados seguros para a atualização.
  return prisma.usuario.update({
  where: { id_usuario: id },
  data: updatableData,
  select: userSelectData,
});
}
/**
 * Excluir usuário
 */
export async function removeUser(id: number) {
  return prisma.usuario.delete({ where: { id_usuario: id } });
}

/**
 * Buscar usuário por ID (sem expor senha)
 */
export async function findUserById(id: number) {
  return prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: userSelectData, // <-- USA O OBJETO REUTILIZÁVEL
  });
}

/**
 * Listar todos os usuários (sem expor senhas)
 */
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
