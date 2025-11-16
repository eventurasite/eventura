// backend/src/middleware/permissionMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware: Permitir acesso apenas para administradores.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (req.user?.tipo !== "administrador") {
    return res.status(403).json({ message: "Acesso permitido somente para administradores." });
  }
  next();
}

/**
 * Middleware: Permite somente o dono do recurso OU o administrador.
 * 
 * @param paramName Nome do parâmetro na rota que contém o ID alvo.
 *                  Ex.: /users/:id → paramName = "id"
 */
export function allowOwnerOrAdmin(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetId = Number(req.params[paramName]);

    // @ts-ignore - vem do middleware authenticateToken
    const userId = req.user?.id;
    // @ts-ignore
    const userType = req.user?.tipo;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Administrador pode tudo
    if (userType === "administrador") {
      return next();
    }

    // Dono do recurso
    if (targetId === userId) {
      return next();
    }

    return res.status(403).json({ message: "Acesso negado. Você não tem permissão para acessar este recurso." });
  };
}

/**
 * Middleware: Permite somente o organizador do evento OU o administrador.
 * 
 * Esse middleware consulta o banco para descobrir o id_organizador.
 */
export function allowEventOwnerOrAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID de evento inválido." });
    }

    // @ts-ignore
    const userId = req.user?.id;
    // @ts-ignore
    const userType = req.user?.tipo;

    try {
      const event = await prisma.evento.findUnique({
        where: { id_evento: eventId },
        select: { id_organizador: true },
      });

      if (!event) {
        return res.status(404).json({ message: "Evento não encontrado." });
      }

      // Admin pode tudo
      if (userType === "administrador") {
        return next();
      }

      // Dono do evento?
      if (event.id_organizador === userId) {
        return next();
      }

      return res.status(403).json({ message: "Acesso negado. Você não é o organizador deste evento." });

    } catch (error) {
      console.error("Erro ao verificar proprietário do evento:", error);
      return res.status(500).json({ message: "Erro interno ao verificar permissão." });
    }
  };
}

/**
 * Middleware: Permite somente o autor do comentário OU o administrador.
 */
export function allowCommentOwnerOrAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId)) {
      return res.status(400).json({ message: "ID de comentário inválido." });
    }

    // @ts-ignore
    const userId = req.user?.id;
    // @ts-ignore
    const userType = req.user?.tipo;

    try {
      const comment = await prisma.comentario.findUnique({
        where: { id_comentario: commentId },
      });

      if (!comment) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }

      // Admin
      if (userType === "administrador") {
        return next();
      }

      // Autor
      if (comment.id_usuario === userId) {
        return next();
      }

      return res.status(403).json({ message: "Acesso negado. Você não pode excluir este comentário." });

    } catch (error) {
      console.error("Erro ao verificar proprietário do comentário:", error);
      return res.status(500).json({ message: "Erro interno ao verificar permissão." });
    }
  };
}
