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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// Servir a pasta de uploads como estática
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;