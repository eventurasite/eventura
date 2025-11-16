// backend/src/routes/eventRoutes.ts

import { Router } from "express";
import multer from "multer";
import multerConfig from "../config/multer";

import * as eventController from "../controllers/eventController";

import { authenticateToken } from "../middleware/authMiddleware";
import {
  requireAdmin,
  allowEventOwnerOrAdmin,
  allowCommentOwnerOrAdmin
} from "../middleware/permissionMiddleware";

const router = Router();
const upload = multer(multerConfig);

// -------------------------------
// Eventos gerais
// -------------------------------

// Criar evento — qualquer usuário autenticado pode criar
router.post(
  "/",
  authenticateToken,
  upload.array("imagens", 5),
  eventController.createEventController
);

// Listar categorias — público
router.get("/categories", eventController.getAllCategories);

// Últimos eventos — público
router.get("/latest", eventController.getLatestEvents);

// Meus eventos — autenticado
router.get("/my-events", authenticateToken, eventController.getMyEvents);

// Filtros — público
router.get("/filter", eventController.getFilteredEvents);

// -------------------------------
// Comentários
// -------------------------------
router.get("/:id/comments", eventController.getCommentsController);

router.post(
  "/:id/comments",
  authenticateToken,
  eventController.createCommentController
);

router.delete(
  "/comments/:commentId",
  authenticateToken,
  allowCommentOwnerOrAdmin(),
  eventController.deleteCommentController
);

// -------------------------------
// Curtidas
// -------------------------------
router.get("/:id/likes", eventController.getTotalLikesController);

router.get(
  "/:id/my-like",
  authenticateToken,
  eventController.getUserLikeStatusController
);

router.post(
  "/:id/like",
  authenticateToken,
  eventController.toggleLikeController
);

// -------------------------------
// Interesses
// -------------------------------
router.get("/:id/interests", eventController.getTotalInterestsController);

router.get(
  "/:id/my-interest",
  authenticateToken,
  eventController.getUserInterestStatusController
);

router.post(
  "/:id/interest",
  authenticateToken,
  eventController.toggleInteresseEvento
);

router.get(
  "/my-interests",
  authenticateToken,
  eventController.getMeusInteresses
);

// -------------------------------
// Denúncias
// -------------------------------

// Criar denúncia — qualquer usuário autenticado
router.post(
  "/denounce",
  authenticateToken,
  eventController.createDenounceController
);

// Rotas ADMIN para denúncias
router.get(
  "/admin/denounces",
  authenticateToken,
  requireAdmin,
  eventController.getPendingDenouncesController
);

router.put(
  "/admin/denounces/:id",
  authenticateToken,
  requireAdmin,
  eventController.updateDenounceStatusController
);

router.delete(
  "/admin/denounces/:id",
  authenticateToken,
  requireAdmin,
  eventController.deleteDenounceController
);

// -------------------------------
// Atualizar / Excluir Eventos
// -------------------------------

// Buscar evento por ID — público
router.get("/:id", eventController.getEvent);

// Atualizar evento — organizador ou admin
router.put(
  "/:id",
  authenticateToken,
  allowEventOwnerOrAdmin(),
  upload.array("imagens", 5),
  eventController.updateEventController
);

// Excluir evento — organizador ou admin
router.delete(
  "/:id",
  authenticateToken,
  allowEventOwnerOrAdmin(),
  eventController.deleteEventController
);

// Listar todos — público
router.get("/", eventController.getAllEvents);

export default router;
