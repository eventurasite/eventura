// backend/src/routes/authRoutes.ts

import { Router } from "express";
import passport from "passport";
import multer from "multer";
import multerConfig from "../config/multer";

import {
  register,
  login,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getMe,
  forgotPasswordController,
  resetPasswordController
} from "../controllers/authController";

import {
  uploadProfileImage,
  removeProfileImage
} from "../controllers/uploadController";

import { authenticateToken } from "../middleware/authMiddleware";
import {
  requireAdmin,
  allowOwnerOrAdmin
} from "../middleware/permissionMiddleware";

const router = Router();
const upload = multer(multerConfig);

// -------------------
// Google OAuth
// -------------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const { token } = req.user as any;
    if (!token) {
      return res.status(500).json({ message: "Erro ao gerar token" });
    }
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// -------------------
// Rotas públicas
// -------------------
router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPasswordController);
router.post("/password/reset", resetPasswordController);

// -------------------
// Rotas protegidas
// -------------------
router.get("/me", authenticateToken, getMe);

// Upload de foto de perfil — apenas o dono ou admin
router.post(
  "/upload/:id",
  authenticateToken,
  allowOwnerOrAdmin("id"),
  upload.single("profileImage"),
  uploadProfileImage
);

router.delete(
  "/upload/:id",
  authenticateToken,
  allowOwnerOrAdmin("id"),
  removeProfileImage
);

// Editar usuário — dono ou admin
router.put(
  "/:id",
  authenticateToken,
  allowOwnerOrAdmin("id"),
  updateUser
);

// Excluir usuário — dono ou admin
router.delete(
  "/:id",
  authenticateToken,
  allowOwnerOrAdmin("id"),
  deleteUser
);

// Buscar usuário — dono ou admin
router.get(
  "/:id",
  authenticateToken,
  allowOwnerOrAdmin("id"),
  getUser
);

// Lista de usuários — somente admin
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  getAllUsers
);

export default router;
