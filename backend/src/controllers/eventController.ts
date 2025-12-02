// backend/src/controllers/eventController.ts
import { Request, Response } from "express";
import * as eventService from "../services/eventService";

/**
 * Criar um novo evento
 */
export async function createEventController(req: Request, res: Response) {
  try {
    const { titulo, descricao, data, local, preco, id_categoria, url_link_externo } = req.body;

    // @ts-ignore
    const id_organizador = req.user.id;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Pelo menos uma imagem é obrigatória." });
    }

    const imagens = files.map(file => `/uploads/${file.filename}`);

    const evento = await eventService.createEvent({
      titulo,
      descricao,
      data: new Date(data),
      local,
      preco: Number(preco),
      id_categoria: Number(id_categoria),
      id_organizador,
      imagens,
      url_link_externo,
    });

    return res.status(201).json({ message: "Evento criado com sucesso!", evento });

  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return res.status(500).json({ message: "Erro interno ao criar o evento." });
  }
}


/**
 * Listar categorias
 */
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categorias = await eventService.findAllCategories();
    return res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar categorias" });
  }
}

/**
 * Listar todos os eventos
 */
export async function getAllEvents(req: Request, res: Response) {
  try {
    const eventos = await eventService.findAllEvents();
    return res.status(200).json(eventos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar eventos" });
  }
}

/**
 * Listar últimos eventos
 */
export async function getLatestEvents(req: Request, res: Response) {
  try {
    const eventos = await eventService.findLatestEvents();
    return res.status(200).json(eventos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar últimos eventos" });
  }
}

/**
 * Buscar evento por ID
 */
export async function getEvent(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const evento = await eventService.getEventById(eventId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    return res.status(200).json(evento);

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Eventos do organizador autenticado
 */
export async function getMyEvents(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const eventos = await eventService.findEventsByOrganizer(userId);
    return res.status(200).json(eventos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar seus eventos" });
  }
}

/**
 * Filtro de eventos
 */
export async function getFilteredEvents(req: Request, res: Response) {
  try {
    const eventos = await eventService.getFilteredEvents(req.query);
    return res.json(eventos);
  } catch (error) {
    console.error("Erro ao filtrar eventos:", error);
    return res.status(500).json({ message: "Erro ao filtrar eventos." });
  }
}

/**
 * Excluir evento
 */
export async function deleteEventController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID do evento inválido." });
    }

    // @ts-ignore
    const userId = req.user.id;
    // @ts-ignore
    const userType = req.user.tipo;

    await eventService.deleteEvent(eventId, userId, userType);

    return res.status(200).json({ message: "Evento excluído com sucesso." });

  } catch (error: any) {
    console.error("Erro ao excluir evento:", error);

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Você não tem permissão para excluir este evento." });
    }

    return res.status(500).json({ message: "Erro interno ao excluir o evento." });
  }
}

/**
 * Atualizar evento
 * (Modificado para suportar imagens)
 */
export async function updateEventController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID do evento inválido." });
    }

    // @ts-ignore
    const userId = req.user.id;

    const { titulo, descricao, data, local, preco, id_categoria, url_link_externo, imgIdsToDelete } = req.body;

    const eventData: any = {};

    if (titulo !== undefined) eventData.titulo = titulo;
    if (descricao !== undefined) eventData.descricao = descricao;
    if (data !== undefined) eventData.data = new Date(data);
    if (local !== undefined) eventData.local = local;
    if (preco !== undefined) eventData.preco = parseFloat(preco);
    if (id_categoria !== undefined) eventData.id_categoria = parseInt(id_categoria, 10);
    if (url_link_externo !== undefined) eventData.url_link_externo = url_link_externo;

    // Processamento de Imagens
    let newImagePaths: string[] = [];
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
        newImagePaths = files.map(file => `/uploads/${file.filename}`);
    }

    // Processamento de Exclusão (Ids chegam como string ou array de strings)
    let idsToDelete: number[] = [];
    if (imgIdsToDelete) {
        if (Array.isArray(imgIdsToDelete)) {
            idsToDelete = imgIdsToDelete.map((id: string) => Number(id));
        } else {
            idsToDelete = [Number(imgIdsToDelete)];
        }
    }

    if (Object.keys(eventData).length === 0 && newImagePaths.length === 0 && idsToDelete.length === 0) {
      return res.status(400).json({ message: "Nenhum dado válido fornecido para atualização." });
    }

    // Chama o serviço passando dados de texto, novas imagens e IDs para deletar
    const eventoAtualizado = await eventService.updateEvent(
        eventId, 
        userId, 
        eventData, 
        newImagePaths, 
        idsToDelete
    );

    return res.status(200).json({ message: "Evento atualizado com sucesso!", evento: eventoAtualizado });

  } catch (error: any) {
    console.error("Erro ao atualizar evento:", error);

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Você não tem permissão para editar este evento." });
    }

    if (error.message === "BAD_REQUEST") {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    return res.status(500).json({ message: "Erro interno ao atualizar o evento." });
  }
}

/**
 * Comentários
 */
export async function getCommentsController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID do evento inválido." });
    }

    const comentarios = await eventService.getCommentsByEventId(eventId);
    return res.status(200).json(comentarios);

  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return res.status(500).json({ message: "Erro interno ao buscar comentários." });
  }
}

export async function createCommentController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // @ts-ignore
    const userId = req.user.id;

    const { texto } = req.body;

    const comentario = await eventService.createComment(eventId, userId, texto);
    return res.status(201).json(comentario);

  } catch (error: any) {
    console.error("Erro ao criar comentário:", error);

    if (error.message.includes("texto do comentário")) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro interno ao criar comentário." });
  }
}

/**
 * Excluir comentário
 */
export async function deleteCommentController(req: Request, res: Response) {
  try {
    const commentId = Number(req.params.commentId);
    // @ts-ignore
    const userId = req.user.id;
    // @ts-ignore
    const userType = req.user.tipo;

    const result = await eventService.deleteComment(commentId, userId, userType);

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Erro ao excluir comentário:", error);

    if (error.message.includes("permissão")) {
      return res.status(403).json({ message: error.message });
    }

    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro interno ao excluir comentário." });
  }
}

/**
 * Curtidas
 */
export async function getTotalLikesController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    const totalLikes = await eventService.getTotalLikes(eventId);
    return res.status(200).json({ totalLikes });
  } catch {
    return res.status(500).json({ message: "Erro ao buscar total de curtidas." });
  }
}

export async function getUserLikeStatusController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // @ts-ignore
    const userId = req.user.id;

    const status = await eventService.getUserLikeStatus(eventId, userId);
    return res.status(200).json(status);

  } catch {
    return res.status(500).json({ message: "Erro ao verificar curtida." });
  }
}

export async function toggleLikeController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // @ts-ignore
    const userId = req.user.id;

    const novoStatus = await eventService.toggleLike(eventId, userId);
    return res.status(200).json(novoStatus);

  } catch {
    return res.status(500).json({ message: "Erro ao processar curtida." });
  }
}

/**
 * Interesses
 */
export async function getTotalInterestsController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    const totalInterests = await eventService.getTotalInterests(eventId);
    return res.status(200).json({ totalInterests });

  } catch {
    return res.status(500).json({ message: "Erro ao buscar total de interesses." });
  }
}

export async function getUserInterestStatusController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // @ts-ignore
    const userId = req.user.id;

    const status = await eventService.getUserInterestStatus(eventId, userId);
    return res.status(200).json(status);

  } catch {
    return res.status(500).json({ message: "Erro ao verificar interesse." });
  }
}

export async function toggleInterestController(req: Request, res: Response) {
  try {
    const eventId = Number(req.params.id);
    // @ts-ignore
    const userId = req.user.id;

    const novoStatus = await eventService.toggleInteresse(eventId, userId);
    return res.status(200).json(novoStatus);

  } catch {
    return res.status(500).json({ message: "Erro ao processar interesse." });
  }
}

export async function toggleInteresseEvento(req: Request, res: Response) {
  try {
    const id_evento = Number(req.params.id);
    // @ts-ignore
    const id_usuario = req.user.id;

    const resultado = await eventService.toggleInteresse(id_evento, id_usuario);
    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro ao alternar interesse:", error);
    return res.status(500).json({ message: "Erro ao registrar interesse." });
  }
}

export async function getMeusInteresses(req: Request, res: Response) {
  try {
    // @ts-ignore
    const id_usuario = req.user.id;
    const eventos = await eventService.buscarEventosPorInteresse(id_usuario);
    return res.status(200).json(eventos);

  } catch {
    return res.status(500).json({ message: "Erro ao buscar eventos de interesse." });
  }
}

/**
 * Denúncias
 */
export async function createDenounceController(req: Request, res: Response) {
  try {
    const { id_evento, motivo } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    const denounce = await eventService.createDenounce(Number(id_evento), userId, motivo);

    return res.status(201).json({
      message: "Denúncia enviada com sucesso!",
      denounce,
    });

  } catch {
    return res.status(500).json({ message: "Erro interno ao enviar a denúncia." });
  }
}

export async function getPendingDenouncesController(req: Request, res: Response) {
  try {
    const denounces = await eventService.getAllPendingDenounces();
    return res.status(200).json(denounces);

  } catch {
    return res.status(500).json({ message: "Erro interno ao listar denúncias." });
  }
}

export async function updateDenounceStatusController(req: Request, res: Response) {
  try {
    const denounceId = Number(req.params.id);
    const { status } = req.body;

    const denounce = await eventService.updateDenounceStatus(denounceId, status);

    return res.status(200).json({
      message: `Denúncia marcada como ${status}.`,
      denounce,
    });

  } catch {
    return res.status(500).json({ message: "Erro interno ao atualizar denúncia." });
  }
}

export async function deleteDenounceController(req: Request, res: Response) {
  try {
    const denounceId = Number(req.params.id);

    await eventService.deleteDenounce(denounceId);

    return res.status(200).json({
      message: "Denúncia excluída com sucesso.",
    });

  } catch {
    return res.status(500).json({ message: "Erro interno ao excluir denúncia." });
  }
}