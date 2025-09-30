import { Router } from "express";
import passport from "passport";
import multer from 'multer';
import multerConfig from '../config/multer';
import {
  register,
  login,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getMe,
} from "../controllers/authController";
import { resetPasswordController, forgotPasswordController } from "../controllers/authController";
import { uploadProfileImage, removeProfileImage } from '../controllers/uploadController';
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();
const upload = multer(multerConfig);

// Rotas Google OAuth
// ... (mantenha as rotas do Google)

router.post("/password/forgot", forgotPasswordController);
router.post("/password/reset", resetPasswordController);

// Rotas locais
router.post("/register", register);
router.post("/login", login);

// --- Rotas Protegidas ---
router.post('/upload/:id', authenticateToken, upload.single('profileImage'), uploadProfileImage);
router.delete('/upload/:id', authenticateToken, removeProfileImage);
router.get("/me", authenticateToken, getMe);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

// no final, para não conflitarem com /me
router.get("/:id", getUser); 
router.get("/", getAllUsers);

export default router;