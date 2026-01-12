const cron = require("node-cron");
const EventObject = require("../models/event");
const { sendOwnerReminder } = require("../services/emailNotification");

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const events = await EventObject.find({
      status: "published",
      start_date: { $gte: now, $lte: in24Hours },
      reminder_sent: { $ne: true },
    });

    for (const event of events) {
      await sendOwnerReminder(event);

      event.reminder_sent = true;
      await event.save();
    }
  } catch (error) {
    console.error("⏰ [Cron] Error in reminder job:", error);
  }
});
