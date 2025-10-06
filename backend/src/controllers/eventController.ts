// backend/src/controllers/eventController.ts
import { Request, Response } from "express";
import {
  findAllEvents,
  findLatestEvents,
  getEventById,
} from "../services/eventService";

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
