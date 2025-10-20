// backend/src/routes/eventRoutes.ts
import { Router } from "express";
import multer from 'multer';
import multerConfig from '../config/multer';
import * as eventController from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();
const upload = multer(multerConfig);

// Rota para criar um novo evento
router.post(
  "/", 
  authenticateToken, 
  upload.array('imagens', 5),
  eventController.createEventController
);

// Rota para listar todas as categorias
router.get("/categories", eventController.getAllCategories);

// Rota para os últimos eventos
router.get("/latest", eventController.getLatestEvents);

// NOVA ROTA: Listar eventos do próprio usuário (protegida)
router.get("/my-events", authenticateToken, eventController.getMyEvents);

// NOVA ROTA DE FILTRO (adicione antes de /:id)
router.get("/filter", eventController.getFilteredEvents);

// Rota para buscar um evento pelo id (deve vir ANTES da rota genérica "/")
router.get("/:id", eventController.getEvent);

router.delete("/:id", authenticateToken, eventController.deleteEventController);

// Rota para listar todos os eventos (agora é a última)
router.get("/", eventController.getAllEvents);

export default router;