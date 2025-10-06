// backend/src/controllers/eventController.ts
import { Request, Response } from "express";
import { 
  findAllEvents, 
  findLatestEvents, 
  getEventById,
  createEvent,
  findAllCategories, 
} from "../services/eventService";

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

    const evento = await createEvent({
      titulo,
      descricao,
      data: new Date(data),
      local,
      preco: parseFloat(preco),
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
    const categorias = await findAllCategories();
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
    const eventos = await findAllEvents();
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
}
/**
 * Listar os 3 últimos eventos
 */
export async function getLatestEvents(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const eventos = await findLatestEvents();
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar últimos eventos" });
  }
}

// recebe id e busca
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const event = await getEventById(eventId);

    if (!event) {
      res.status(404).json({ message: "Evento não encontrado" });
      return;
    }

    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
