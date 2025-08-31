import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;
