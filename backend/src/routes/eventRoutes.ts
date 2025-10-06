// backend/src/routes/eventRoutes.ts
import { Router } from "express";
import multer from 'multer';
import multerConfig from '../config/multer';
import { 
  getAllEvents, 
  getLatestEvents,
  createEventController,
  getEvent,
  getAllCategories
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();
const upload = multer(multerConfig);

// Rota para criar um novo evento (protegida e com upload de imagens)
router.post(
  "/", 
  authenticateToken, 
  upload.array('imagens', 5), // 'imagens' é o nome do campo, 5 é o número máximo de arquivos
  createEventController
);

// Rota para listar todas as categorias
router.get("/categories", getAllCategories);

// Rota para os últimos eventos
router.get("/latest", getLatestEvents);

// Rota para listar todos os eventos
router.get("/", getAllEvents);

// Rota para listar o evento pelo id
router.get("/:id", getEvent);
export default router;
