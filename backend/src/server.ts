import dotenv from "dotenv";
import app from "./app";
import { startReminderJob } from "./jobs/reminderJob";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startReminderJob();
});
