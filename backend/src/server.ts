import dotenv from "dotenv";
import app from "./app";
import { startReminderJob } from "./jobs/reminderJob";

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL =
  process.env.BACKEND_URL     // Produção (configurar no servidor)
  || `http://localhost:${PORT}`; // Desenvolvimento

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em: ${BASE_URL}/api/docs`);
  startReminderJob();
});
