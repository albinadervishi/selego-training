const express = require("express");
const router = express.Router();
const EventObject = require("../models/event");
const { notifyEventChange, sendOwnerReminder } = require("../services/emailNotification");
const { CRON_SECRET } = require("../config");
const { getChangedEvents, watchCalendar } = require("./googleCalendar");

let calendarSyncToken = null;

router.post("/google-calendar-sync", async (req, res) => {
  try {
    const resourceState = req.headers["x-goog-resource-state"];
    const channelId = req.headers["x-goog-channel-id"];

    res.status(200).send({ ok: true });

    if (resourceState === "sync") {
      console.log("Webhook sync confirmed");
      return;
    }

    if (resourceState === "exists") {
      const { ok, events, nextSyncToken } = await getChangedEvents(calendarSyncToken);

      if (ok) {
        calendarSyncToken = nextSyncToken;

        for (const googleEvent of events) {
          if (googleEvent.status === "cancelled") {
            await EventObject.findOneAndDelete({ google_calendar_id: googleEvent.id });
          } else {
            const updates = {
              title: googleEvent.summary,
              description: googleEvent.description || "",
            };

            if (googleEvent.start?.dateTime) {
              updates.start_date = new Date(googleEvent.start.dateTime);
            }
            if (googleEvent.end?.dateTime) {
              updates.end_date = new Date(googleEvent.end.dateTime);
            }

            await EventObject.findOneAndUpdate({ google_calendar_id: googleEvent.id }, { $set: updates });
          }
        }
      }
    }
  } catch (error) {
    console.error("Google webhook error:", error);
  }
});

router.post("/setup-google-watch", async (req, res) => {
  try {
    const { secret } = req.body;

    if (secret !== CRON_SECRET) {
      return res.status(401).send({ ok: false, code: "UNAUTHORIZED" });
    }

    const result = await watchCalendar();

    return res.status(200).send(result);
  } catch (error) {
    console.error("Setup watch error:", error);
    res.status(500).send({ ok: false, error: error.message });
  }
});

module.exports = router;
