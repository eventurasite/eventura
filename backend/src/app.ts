// backend/src/app.ts
import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import "./config/passport";

import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";

// 🔥 IMPORTANTE: Swagger
import { setupSwagger } from "./config/swagger";

const app = express();

// -------------------------------------------
// CORS
// -------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// -------------------------------------------
// ARQUIVOS ESTÁTICOS
// -------------------------------------------

// uploads enviados pelos usuários
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// imagens seed do frontend
app.use(
  "/assets",
  express.static(
    path.resolve(__dirname, "..", "..", "frontend", "public", "assets")
  )
);

// -------------------------------------------
// SWAGGER (DEVE VIR ANTES DAS ROTAS DA API)
// -------------------------------------------
setupSwagger(app);

// -------------------------------------------
// ROTAS DA API
// -------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// -------------------------------------------
// HEALTHCHECK
// -------------------------------------------
app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;
