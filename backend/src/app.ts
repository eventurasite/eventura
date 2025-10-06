// backend/src/app.ts
import express from "express";
import cors from "cors";
import passport from "passport";
import path from 'path';
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ---

// CORREÇÃO: O caminho para a pasta 'uploads' estava errado.
// O correto é subir apenas um nível a partir da pasta 'dist' onde o código roda.
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Servir a pasta de assets do frontend para as imagens do seed (este já estava correto)
app.use('/assets', express.static(path.resolve(__dirname, '..', '..', 'frontend', 'public', 'assets')));


// --- ROTAS DA API ---
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;