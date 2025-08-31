import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  editUser,
  removeUser,
  findUserById,
  findAllUsers,
} from "../services/authService";

/**
 * Criar usuário
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

    if (error.message.includes("E-mail já cadastrado via Google")) {
      res.status(409).json({ provider: "google", message: error.message });
    } else if (error.message.includes("E-mail já cadastrado")) {
      res.status(409).json({ message: error.message }); // 409 Conflict
    } else {
      res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  }
}

/**
 * Login
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
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "GOOGLE_LOGIN") {
      // 👉 resposta especial para o frontend redirecionar
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
    const id = Number(req.params.id);
    const usuario = await editUser(id, req.body);

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
    const id = Number(req.params.id);
    await removeUser(id);
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
