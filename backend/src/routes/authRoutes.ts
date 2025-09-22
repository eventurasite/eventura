import { Router } from "express";
import passport from "passport";
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
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Rotas Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account", // <-- força o popup de escolha de conta
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
      console.error("Token ausente em req.user:", req.user);
      return res.status(500).json({ message: "Erro ao gerar token" });
    }

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

router.post("/password/forgot", forgotPasswordController);
router.post("/password/reset", resetPasswordController);

// Rotas locais
router.post("/register", register);
router.post("/login", login);

// --- Rotas Protegidas ---
router.get("/me", authenticateToken, getMe);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

// no final, para não conflitarem com /me
router.get("/:id", getUser); 
router.get("/", getAllUsers);

export default router;
