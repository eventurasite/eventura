import { Router } from "express";
import { register, login, deleteUser, updateUser, getUser, getAllUsers } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
