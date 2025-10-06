// backend/src/routes/eventRoutes.ts
import { Router } from "express";
import multer from 'multer';
import multerConfig from '../config/multer';
import { 
  getAllEvents, 
  getLatestEvents,
  createEventController,
  getEvent,
  getAllCategories,
  getMyEvents,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();
const upload = multer(multerConfig);

// Rota para criar um novo evento
router.post(
  "/", 
  authenticateToken, 
  upload.array('imagens', 5),
  createEventController
);

// Rota para listar todas as categorias
router.get("/categories", getAllCategories);

// Rota para os últimos eventos
router.get("/latest", getLatestEvents);

// NOVA ROTA: Listar eventos do próprio usuário (protegida)
router.get("/my-events", authenticateToken, getMyEvents);

// --- ORDEM CORRIGIDA AQUI ---
// Rota para buscar um evento pelo id (deve vir ANTES da rota genérica "/")
router.get("/:id", getEvent);

// Rota para listar todos os eventos (agora é a última)
router.get("/", getAllEvents);

export default router;