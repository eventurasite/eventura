// backend/src/controllers/eventController.ts
import { Request, Response } from "express";
import * as eventService from "../services/eventService";
// Importar tipos necessários
import { Evento, Prisma } from "@prisma/client";

/**
 * Criar um novo evento
 */
export async function createEventController(req: Request, res: Response): Promise<void> {
  try {
    const { titulo, descricao, data, local, preco, id_categoria } = req.body;
    // @ts-ignore
    const id_organizador = req.user.id; // Vem do token JWT

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: "Pelo menos uma imagem é obrigatória." });
      return;
    }

    const imagens = files.map(file => ({ url: `/uploads/${file.filename}` }));

    const evento = await eventService.createEvent({
      titulo,
      descricao,
      data: new Date(data),
      local,
      preco: parseFloat(preco), // Service aceita number
      id_categoria: parseInt(id_categoria, 10),
      id_organizador,
      imagens,
    });

    res.status(201).json({ message: "Evento criado com sucesso!", evento });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ message: "Erro interno ao criar o evento." });
  }
}

/**
 * Listar todas as categorias
 */
export async function getAllCategories(req: Request, res: Response): Promise<void> {
  try {
    const categorias = await eventService.findAllCategories();
    res.status(200).json(categorias);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar categorias" });
  }
}

/**
 * Listar todos os eventos
 */
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const eventos = await eventService.findAllEvents();
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
}

/**
 * Listar os 3 últimos eventos
 */
export async function getLatestEvents(req: Request, res: Response): Promise<void> {
  try {
    const eventos = await eventService.findLatestEvents();
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar últimos eventos" });
  }
}

/**
 * Buscar evento por ID
 */
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID inválido" }); return;
    }
    const event = await eventService.getEventById(eventId);
    if (!event) {
      res.status(404).json({ message: "Evento não encontrado" }); return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Listar eventos do organizador autenticado
 */
export async function getMyEvents(req: Request, res: Response): Promise<void> {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const eventos = await eventService.findEventsByOrganizer(userId);
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar seus eventos" });
  }
}

/**
 * FILTRAR EVENTOS
 */
export const getFilteredEvents = async (req: Request, res: Response) => {
  try {
    const { categoria, mes, preco, busca } = req.query;
    const eventos = await eventService.getFilteredEvents({
      categoria: categoria as string,
      mes: mes as string,
      preco: preco as string,
      busca: busca as string,
    });
    res.json(eventos);
  } catch (error) {
    console.error("Erro ao filtrar eventos:", error);
    res.status(500).json({ message: "Erro ao filtrar eventos." });
  }
};

/**
 * Excluir um evento
 */
export async function deleteEventController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id;
    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID do evento inválido." }); return;
    }
    await eventService.deleteEvent(eventId, userId);
    res.status(200).json({ message: "Evento excluído com sucesso." });
  } catch (error: any) {
    console.error("Erro ao excluir evento:", error);
    if (error.message === 'NOT_FOUND') res.status(404).json({ message: "Evento não encontrado." });
    else if (error.message === 'FORBIDDEN') res.status(403).json({ message: "Você não tem permissão para excluir este evento." });
    else res.status(500).json({ message: "Erro interno ao excluir o evento." });
  }
}

/**
 * Atualizar um evento existente
 */
export async function updateEventController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id;

    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID do evento inválido." }); return;
    }

    const { titulo, descricao, data, local, preco, id_categoria } = req.body;

    // --- CORREÇÃO APLICADA ---
    // Define o tipo para o objeto que será passado para o service
    // Este tipo corresponde ao esperado pela função updateEvent no service
    const eventDataForService: {
        titulo?: string;
        descricao?: string;
        data?: Date;
        local?: string;
        preco?: number; // Service espera number | undefined
        id_categoria?: number;
    } = {};

    // Preenche o objeto apenas com os campos definidos que vieram do body
    if (titulo !== undefined) eventDataForService.titulo = titulo;
    if (descricao !== undefined) eventDataForService.descricao = descricao;
    if (data !== undefined) eventDataForService.data = new Date(data);
    if (local !== undefined) eventDataForService.local = local;
    if (preco !== undefined) eventDataForService.preco = parseFloat(preco);
    if (id_categoria !== undefined) eventDataForService.id_categoria = parseInt(id_categoria, 10);
    // --- FIM DA CORREÇÃO ---


    // Verifica se há algo para atualizar
    if (Object.keys(eventDataForService).length === 0) {
        res.status(400).json({ message: "Nenhum dado válido fornecido para atualização." });
        return;
    }

    // Chama o service com o objeto tipado corretamente
    const eventoAtualizado = await eventService.updateEvent(eventId, userId, eventDataForService);

    res.status(200).json({ message: "Evento atualizado com sucesso!", evento: eventoAtualizado });

  } catch (error: any) {
    console.error("Erro ao atualizar evento:", error);
    if (error.message === 'NOT_FOUND') res.status(404).json({ message: "Evento não encontrado." });
    else if (error.message === 'FORBIDDEN') res.status(403).json({ message: "Você não tem permissão para editar este evento." });
    else if (error.message === 'BAD_REQUEST') res.status(400).json({ message: "Dados inválidos fornecidos." });
    else res.status(500).json({ message: "Erro interno ao atualizar o evento." });
  }
}

/**
 * Buscar comentários de um evento
 */
export async function getCommentsController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID do evento inválido." }); return;
    }

    const comentarios = await eventService.getCommentsByEventId(eventId);
    res.status(200).json(comentarios);

  } catch (error: any) {
    console.error("Erro ao buscar comentários:", error);
    res.status(500).json({ message: "Erro interno ao buscar comentários." });
  }
}

/**
 * Criar um novo comentário
 */
export async function createCommentController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id; // Vem do token (authMiddleware)
    const { texto } = req.body;

    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID do evento inválido." }); return;
    }

    const novoComentario = await eventService.createComment(eventId, userId, texto);
    res.status(201).json(novoComentario);

  } catch (error: any) {
    console.error("Erro ao criar comentário:", error);
    if (error.message.includes("texto do comentário")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro interno ao criar o comentário." });
    }
  }
}

/**
 * Buscar total de curtidas (Público)
 */
export async function getTotalLikesController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    const totalLikes = await eventService.getTotalLikes(eventId);
    res.status(200).json({ totalLikes });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao buscar total de curtidas." });
  }
}

/**
 * Verificar se o usuário logado curtiu (Protegido)
 */
export async function getUserLikeStatusController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id; // Vem do token

    const status = await eventService.getUserLikeStatus(eventId, userId);
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao verificar curtida." });
  }
}

/**
 * Adicionar/Remover curtida (Protegido)
 */
export async function toggleLikeController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id; // Vem do token

    const novoStatus = await eventService.toggleLike(eventId, userId);
    res.status(200).json(novoStatus);
  } catch (error: any)
 {
    res.status(500).json({ message: "Erro ao processar curtida." });
  }
}

/**
 * Buscar total de interesses (Público)
 */
export async function getTotalInterestsController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    const totalInterests = await eventService.getTotalInterests(eventId);
    res.status(200).json({ totalInterests });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao buscar total de interesses." });
  }
}

/**
 * Verificar se o usuário logado tem interesse (Protegido)
 */
export async function getUserInterestStatusController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id; // Vem do token

    const status = await eventService.getUserInterestStatus(eventId, userId);
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao verificar interesse." });
  }
}

/**
 * Adicionar/Remover interesse (Protegido)
 */
export async function toggleInterestController(req: Request, res: Response): Promise<void> {
  try {
    const eventId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id; // Vem do token

    const novoStatus = await eventService.toggleInteresse(eventId, userId);
    res.status(200).json(novoStatus);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao processar interesse." });
  }
}

// 🔹 POST /api/events/:id/interest → Alternar interesse
export async function toggleInteresseEvento(req: any, res: Response) {
  try {
    const id_evento = Number(req.params.id);
    // @ts-ignore - o middleware popula req.user com os dados do token
    const id_usuario = req.user.id;

    if (!id_evento || isNaN(id_evento)) {
      return res.status(400).json({ message: "ID de evento inválido." });
    }

    const resultado = await eventService.toggleInteresse(id_evento, id_usuario);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao alternar interesse:", error);
    res.status(500).json({ message: "Erro ao registrar interesse." });
  }
}

// 🔹 GET /api/events/my-interests → Buscar eventos que o usuário marcou interesse
export async function getMeusInteresses(req: any, res: Response) {
  try {
    // @ts-ignore - o middleware popula req.user com os dados do token
    const id_usuario = req.user.id;
    const eventos = await eventService.buscarEventosPorInteresse(id_usuario);
    res.status(200).json(eventos);
  } catch (error) {
    console.error("Erro ao buscar meus interesses:", error);
    res.status(500).json({ message: "Erro ao buscar eventos de interesse." });
  }
}