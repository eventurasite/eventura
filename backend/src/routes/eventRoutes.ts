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

// Esta rota é esperada pela página MyInterests.jsx
router.get("/my-interests", authenticateToken, eventController.getMyInterestsController);

// NOVA ROTA DE FILTRO (adicione antes de /:id)
router.get("/filter", eventController.getFilteredEvents);

// NOVAS ROTAS DE COMENTÁRIOS
router.get("/:id/comments", eventController.getCommentsController);
router.post("/:id/comments", authenticateToken, eventController.createCommentController);

//ROTAS DE CURTIDAS
router.get("/:id/likes", eventController.getTotalLikesController); // Pública
router.get("/:id/my-like", authenticateToken, eventController.getUserLikeStatusController); // Protegida
router.post("/:id/like", authenticateToken, eventController.toggleLikeController); // Protegida

//ROTAS DE INTERESSES
router.get("/:id/interests", eventController.getTotalInterestsController); // Pública
router.get("/:id/my-interest", authenticateToken, eventController.getUserInterestStatusController); // Protegida
router.post("/:id/interest", authenticateToken, eventController.toggleInterestController); // Protegida

// Rota para buscar um evento pelo id (deve vir ANTES da rota genérica "/")
router.get("/:id", eventController.getEvent);

// NOVA ROTA: Atualizar um evento (requer autenticação)
router.put("/:id", authenticateToken, upload.array('imagens', 5), eventController.updateEventController);

//Rota para excluir um evento (requer autenticação)
router.delete("/:id", authenticateToken, eventController.deleteEventController);

// Rota para listar todos os eventos
router.get("/", eventController.getAllEvents);

export default router;