import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from "../controllers/authController";

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

// Rotas locais
router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
