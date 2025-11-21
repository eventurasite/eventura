// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  editUser,
  removeUser,
  findUserById,
  findAllUsers,
  forgotPassword,
  resetPassword,
  verifyEmailService,
} from "../services/authService";

/* -------------------------------------------------------------------------- */
/*                                   REGISTER                                 */
/* -------------------------------------------------------------------------- */
export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      message: result.message, // "Cadastro realizado! Verifique seu e-mail..."
    });
  } catch (error: any) {
    console.error(error);

    if (error.message?.includes("senha")) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message?.includes("Google")) {
      return res.status(409).json({ provider: "google", message: error.message });
    }

    if (error.message?.includes("E-mail já cadastrado")) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
}

/* -------------------------------------------------------------------------- */
/*                                     LOGIN                                  */
/* -------------------------------------------------------------------------- */
export async function login(req: Request, res: Response) {
  try {
    const usuario = await loginUser(req.body);

    return res.status(200).json({
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
      return res.status(400).json({ provider: "google", message: error.message });
    }

    if (error.message?.includes("Usuário não encontrado")) {
      return res.status(404).json({ message: error.message });
    }

    if (error.message?.includes("Senha incorreta")) {
      return res.status(401).json({ message: error.message });
    }

    if (error.message?.includes("Confirme seu e-mail")) {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro ao realizar login" });
  }
}

/* -------------------------------------------------------------------------- */
/*                           VERIFY EMAIL (NOVO)                              */
/* -------------------------------------------------------------------------- */
export async function verifyEmailController(req: Request, res: Response) {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({ message: "Token não fornecido." });
    }

    const result = await verifyEmailService(token);

    return res.status(200).json(result); // { message: "E-mail verificado com sucesso!" }

  } catch (error: any) {
    console.error("Erro ao verificar e-mail:", error);

    if (error.message?.includes("Token")) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro ao verificar e-mail." });
  }
}

/* -------------------------------------------------------------------------- */
/*                               FORGOT PASSWORD                               */
/* -------------------------------------------------------------------------- */
export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const result = await forgotPassword(req.body.email);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Erro ao solicitar redefinição." });
  }
}

/* -------------------------------------------------------------------------- */
/*                                RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */
export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Erro ao redefinir senha." });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 GET ME (SELF)                               */
/* -------------------------------------------------------------------------- */
export async function getMe(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const usuario = await findUserById(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro em getMe:", error);
    return res.status(500).json({ message: "Erro ao buscar dados do usuário" });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 UPDATE USER                                 */
/* -------------------------------------------------------------------------- */
export async function updateUser(req: Request, res: Response) {
  try {
    const targetUserId = Number(req.params.id);

    // @ts-ignore
    const requesterId = req.user.id;
    // @ts-ignore
    const requesterType = req.user.tipo;

    const usuario = await editUser(requesterId, requesterType, targetUserId, req.body);

    return res.status(200).json({
      message: "Usuário atualizado com sucesso",
      usuario,
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Você não tem permissão para editar este usuário." });
    }

    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 DELETE USER                                 */
/* -------------------------------------------------------------------------- */
export async function deleteUser(req: Request, res: Response) {
  try {
    const targetUserId = Number(req.params.id);

    // @ts-ignore
    const requesterId = req.user.id;
    // @ts-ignore
    const requesterType = req.user.tipo;

    if (requesterType !== "administrador" && requesterId !== targetUserId) {
      return res.status(403).json({
        message: "Acesso negado. Você não tem permissão para excluir este usuário.",
      });
    }

    await removeUser(targetUserId);

    return res.status(200).json({ message: "Usuário removido com sucesso" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao remover usuário" });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 GET USER BY ID                              */
/* -------------------------------------------------------------------------- */
export async function getUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await findUserById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
}

/* -------------------------------------------------------------------------- */
/*                                GET ALL USERS                                */
/* -------------------------------------------------------------------------- */
export async function getAllUsers(req: Request, res: Response) {
  try {
    const usuarios = await findAllUsers();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar usuários" });
  }
}
