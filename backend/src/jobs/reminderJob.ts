import cron from "node-cron";
import { sendEventReminders } from "../services/reminderService";

export function startReminderJob() {
  cron.schedule("0 8 * * *", async () => {
    console.log("[CRON] Verificando eventos para lembretes...");
    await sendEventReminders();
  });
}
