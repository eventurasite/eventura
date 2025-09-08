// backend/src/routes/eventRoutes.ts
import { Router } from "express";
import { getAllEvents, getLatestEvents } from "../controllers/eventController";

const router = Router();

//rota para os últimos eventos
router.get("/latest", getLatestEvents);

// Rota para listar todos os eventos
router.get("/", getAllEvents);

export default router;