// backend/src/controllers/eventController.ts
import { Request, Response } from "express";
import { findAllEvents, findLatestEvents } from "../services/eventService";

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
export async function getLatestEvents(req: Request, res: Response): Promise<void> {
  try {
    const eventos = await findLatestEvents();
    res.status(200).json(eventos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar últimos eventos" });
  }
}