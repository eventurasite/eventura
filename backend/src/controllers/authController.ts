import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  editUser,
  removeUser,
  findUserById,
  findAllUsers,
} from "../services/authService";
import * as authService from "../services/authService";

/**
 * Criar usuário (registro local)
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await registerUser(req.body);
    res.status(201).json({
      message: "Usuário registrado com sucesso",
      id_usuario: usuario.id_usuario,
    });
  } catch (error: any) {
    console.error(error);

    if (error.message.includes("senha")) {
      res.status(400).json({ message: error.message });
    } else if (error.message.includes("E-mail já cadastrado via Google")) {
      res.status(409).json({ provider: "google", message: error.message });
    } else if (error.message.includes("E-mail já cadastrado")) {
      res.status(409).json({ message: error.message });
    } else if (error.message.includes("Email não informado")) {
      res.status(400).json({ message: error.message });
    } else if (error.message.includes("Senha não informada")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  }
}

/**
 * Login local (email e senha)
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await loginUser(req.body);
    res.status(200).json({
      message: "Login bem-sucedido",
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      tipo: usuario.tipo,
      token: usuario.token,
      url_foto_perfil: usuario.url_foto_perfil,
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "GOOGLE_LOGIN") {
      res.status(400).json({ provider: "google", message: error.message });
    } else if (error.message.includes("Usuário não encontrado")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("Senha incorreta")) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao realizar login" });
    }
  }
}

/**
 * Atualizar usuário
 */
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const targetUserId = Number(req.params.id);
    // @ts-ignore - Ignoramos o erro do TS aqui pois sabemos que req.user é populado pelo middleware
    const authenticatedUserId = req.user.id; // ID do usuário logado (vem do token)

    // Regra de segurança: um usuário só pode editar o seu próprio perfil.
    // (Futuramente, um admin poderia ser uma exceção a essa regra).
    if (targetUserId !== authenticatedUserId) {
      res.status(403).json({ message: "Acesso negado. Você não tem permissão para editar este usuário." });
      return;
    }

    const usuario = await editUser(targetUserId, req.body);

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      usuario,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

/**
 * Excluir usuário
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const targetUserId = Number(req.params.id);
    // @ts-ignore
    const authenticatedUserId = req.user.id; // ID do usuário logado (vem do token)

    if (targetUserId !== authenticatedUserId) {
      res.status(403).json({ message: "Acesso negado. Você não tem permissão para excluir este usuário." });
      return;
    }

    await removeUser(targetUserId);
    res.status(200).json({ message: "Usuário removido com sucesso" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover usuário" });
  }
}

/**
 * Buscar usuário por ID
 */
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const usuario = await findUserById(id);

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
}

/**
 * Listar todos os usuários
 */
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const usuarios = await findAllUsers();
    res.status(200).json(usuarios);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar usuários" });
  }
}

/**
 * Esqueci minha senha
 */
export async function forgotPasswordController(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Erro ao solicitar redefinição" });
  }
}

/**
 * Redefinir senha
 */
export async function resetPasswordController(req: Request, res: Response) {
  const { token, password } = req.body;

  try {
    const result = await authService.resetPassword(token, password);
    return res.status(200).json(result);
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: err.message || "Erro ao redefinir senha" });
  }
}

/**
 * Buscar dados do próprio usuário autenticado
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const usuario = await findUserById(userId);

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error: any) {
    console.error("Erro em getMe:", error);
    res.status(500).json({ message: "Erro ao buscar dados do usuário" });
  }
}