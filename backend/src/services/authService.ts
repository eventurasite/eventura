import { PrismaClient, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt";
import { sendResetEmail, sendEmailVerification } from "./mailService";
// REMOVIDO: As importações de 'validate' e 'schema' foram removidas.

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
/* REGISTER USER                                */
/* -------------------------------------------------------------------------- */
export async function registerUser(data: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  descricao?: string;
}) {
  const { nome, email, senha, telefone, descricao } = data;

  // A validação Zod é feita na camada de rota (middleware).

  const existing = await prisma.usuario.findUnique({ where: { email } });

  if (existing) {
    if (existing.authProvider === "google") {
      throw new Error("E-mail já cadastrado via Google");
    }
    throw new Error("E-mail já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const newUser = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      telefone: telefone || "",
      descricao: descricao || "",
      tipo: TipoUsuario.comum,
      authProvider: "local",
      email_verified: false,
    },
  });

  // GERAR TOKEN
  const verifyTokenValue = generateToken({
    id: newUser.id_usuario,
    purpose: "verify_email",
  });

  // MONTAR LINK DE VERIFICAÇÃO
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyTokenValue}`;

  // ENVIAR EMAIL
  await sendEmailVerification(newUser.email, newUser.nome, verifyLink);

  return {
    message: "Cadastro realizado! Verifique seu e-mail para ativar sua conta.",
  };
}

/* -------------------------------------------------------------------------- */
/* LOGIN USER                                 */
/* -------------------------------------------------------------------------- */
export async function loginUser({
  email,
  senha,
}: {
  email: string;
  senha: string;
}) {
  // A validação Zod é feita na camada de rota (middleware).

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  // BLOQUEAR LOGIN PARA NÃO VERIFICADOS
  if (!usuario.email_verified) {
    throw new Error("Confirme seu e-mail antes de acessar sua conta.");
  }

  if (usuario.authProvider === "google" && !usuario.senha) {
    const err: any = new Error("Faça login com o Google");
    err.code = "GOOGLE_LOGIN";
    throw err;
  }

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
/* VERIFY EMAIL SERVICE                             */
/* -------------------------------------------------------------------------- */
export async function verifyEmailService(token: string) {
  if (!token) throw new Error("Token não informado");

  let payload: any;
  try {
    payload = verifyToken(token);
  } catch {
    throw new Error("Token inválido ou expirado");
  }

  if (payload.purpose !== "verify_email") {
    throw new Error("Token inválido");
  }

  const user = await prisma.usuario.findUnique({
    where: { id_usuario: payload.id },
  });

  if (!user) throw new Error("Usuário não encontrado");

  await prisma.usuario.update({
    where: { id_usuario: user.id_usuario },
    data: { email_verified: true },
  });

  return { message: "E-mail verificado com sucesso!" };
}

/* -------------------------------------------------------------------------- */
/* FORGOT PASSWORD                               */
/* -------------------------------------------------------------------------- */
export async function forgotPassword(email: string) {
  // A validação Zod é feita na camada de rota (middleware).

  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
  }

  const token = generateToken({ id: user.id_usuario });

  const resetLink = `${process.env.APP_URL}/resetpassword?token=${token}`;
  await sendResetEmail(user.email, user.nome, resetLink);

  return { message: "Se o e-mail existir, enviaremos um link de redefinição." };
}

/* -------------------------------------------------------------------------- */
/* RESET PASSWORD                                */
/* -------------------------------------------------------------------------- */
export async function resetPassword(token: string, password: string) {
  // A validação Zod é feita na camada de rota (middleware).

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
/* EDIT USER                                  */
/* -------------------------------------------------------------------------- */
export async function editUser(
  requesterId: number,
  requesterType: TipoUsuario,
  targetUserId: number,
  data: any
) {
  // A validação Zod é feita na camada de rota (middleware).
  const currentUser = await prisma.usuario.findUnique({
    where: { id_usuario: targetUserId },
  });

  if (!currentUser) {
    throw new Error("Usuário não encontrado.");
  }

  const isAdmin = requesterType === TipoUsuario.administrador;

  if (!isAdmin && requesterId !== targetUserId) {
    throw new Error("FORBIDDEN");
  }

  if (
    currentUser.authProvider === "google" &&
    data.email &&
    currentUser.email !== data.email
  ) {
    throw new Error("Usuários autenticados com o Google não podem alterar o e-mail.");
  }

  const updatableData: {
    nome?: string;
    email?: string;
    telefone?: string;
    descricao?: string;
    url_foto_perfil?: string;
    tipo?: TipoUsuario;
  } = {};

  if (data.nome) updatableData.nome = data.nome;
  if (data.email) {
    // A validação de formato do email é feita pelo Zod na rota.
    updatableData.email = data.email;
  }
  if (data.telefone !== undefined) updatableData.telefone = data.telefone;
  if (data.descricao !== undefined) updatableData.descricao = data.descricao;
  if (data.url_foto_perfil) updatableData.url_foto_perfil = data.url_foto_perfil;
  if (data.tipo && isAdmin) updatableData.tipo = data.tipo;

  return prisma.usuario.update({
    where: { id_usuario: targetUserId },
    data: updatableData,
    select: userSelectData,
  });
}

/* -------------------------------------------------------------------------- */
/* DELETE USER                                 */
/* -------------------------------------------------------------------------- */
export async function removeUser(id: number) {
  // 1. Buscar IDs de todos os eventos criados por este usuário.
  // Isso é necessário porque a exclusão de Evento tem várias dependências (Comentario, Curtida, etc.)
  const userEvents = await prisma.evento.findMany({
    where: { id_organizador: id },
    select: { id_evento: true },
  });

  const eventIds = userEvents.map(e => e.id_evento);

  // 2. Executar uma transação para garantir que todas as exclusões sejam atômicas.
  return prisma.$transaction(async (tx) => {
    
    // --- 2.1. Excluir Dependências dos Eventos Criados ---
    // Se o usuário criou eventos, precisamos apagar as dependências DESSES eventos
    if (eventIds.length > 0) {
      await tx.comentario.deleteMany({ where: { id_evento: { in: eventIds } } });
      await tx.curtida.deleteMany({ where: { id_evento: { in: eventIds } } });
      await tx.denuncia.deleteMany({ where: { id_evento: { in: eventIds } } });
      await tx.interesse.deleteMany({ where: { id_evento: { in: eventIds } } });
      await tx.imagemEvento.deleteMany({ where: { id_evento: { in: eventIds } } });
      
      // 2.2. Excluir os próprios Eventos criados pelo usuário
      await tx.evento.deleteMany({ where: { id_organizador: id } });
    }
    
    // --- 2.3. Excluir Dependências Diretas do Usuário ---
    // Interações feitas pelo usuário em eventos de terceiros
    await tx.curtida.deleteMany({ where: { id_usuario: id } });
    await tx.comentario.deleteMany({ where: { id_usuario: id } });
    await tx.denuncia.deleteMany({ where: { id_usuario: id } });
    await tx.interesse.deleteMany({ where: { id_usuario: id } });

    // 2.4. Excluir o Usuário finalmente
    await tx.usuario.delete({ where: { id_usuario: id } });
  });
}

/* -------------------------------------------------------------------------- */
/* FIND USER BY ID                               */
/* -------------------------------------------------------------------------- */
export async function findUserById(id: number) {
  return prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: userSelectData,
  });
}

/* -------------------------------------------------------------------------- */
/* FIND ALL USERS                                */
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