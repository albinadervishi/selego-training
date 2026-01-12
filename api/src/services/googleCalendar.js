const { google } = require("googleapis");
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = require("../config");
const { API_URL } = require("../config");

const auth = new google.auth.JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

async function exportEvent(event) {
  try {
    const googleEvent = {
      summary: event.title,
      description: event.description || "",
      location: [event.venue, event.address, event.city, event.country].filter(Boolean).join(", "),
      start: {
        dateTime: new Date(event.start_date).toISOString(),
        timeZone: "Europe/Paris",
      },
      end: {
        dateTime: event.end_date
          ? new Date(event.end_date).toISOString()
          : new Date(new Date(event.start_date).getTime() + 3600000).toISOString(),
        timeZone: "Europe/Paris",
      },
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      resource: googleEvent,
    });

    return {
      ok: true,
      googleEventId: response.data.id,
      googleEventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error("Error exporting event to Google Calendar:", error.message);
    return { ok: false, error: error.message };
  }
}

async function updateEvent(googleEventId, event) {
  try {
    const googleEvent = {
      summary: event.title,
      description: event.description || "",
      location: [event.venue, event.address, event.city, event.country].filter(Boolean).join(", "),
      start: {
        dateTime: new Date(event.start_date).toISOString(),
        timeZone: "Europe/Paris",
      },
      end: {
        dateTime: event.end_date
          ? new Date(event.end_date).toISOString()
          : new Date(new Date(event.start_date).getTime() + 3600000).toISOString(),
        timeZone: "Europe/Paris",
      },
    };

    const response = await calendar.events.update({
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      eventId: googleEventId,
      resource: googleEvent,
    });

    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error updating event in Google Calendar:", error.message);
    return { ok: false, error: error.message };
  }
}

async function deleteEvent(googleEventId) {
  try {
    await calendar.events.delete({
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      eventId: googleEventId,
    });

    return { ok: true };
  } catch (error) {
    console.error("Error deleting event in Google Calendar:", error.message);
    return { ok: false, error: error.message };
  }
}

async function watchCalendar() {
  try {
    const response = await calendar.events.watch({
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      resource: {
        id: `eventhub-channel-${Date.now()}`,
        type: "web_hook",
        address: `${API_URL}/webhook/google-calendar-sync`,
        expiration: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    });

    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Failed to watch calendar:", error.message);
    return { ok: false, error: error.message };
  }
}

async function getChangedEvents(syncToken = null) {
  try {
    const params = {
      calendarId: GOOGLE_CALENDAR_ID || "primary",
      singleEvents: true,
    };

    if (syncToken) {
      params.syncToken = syncToken;
    } else {
      params.timeMin = new Date().toISOString();
    }

    const response = await calendar.events.list(params);

    return {
      ok: true,
      events: response.data.items || [],
      nextSyncToken: response.data.nextSyncToken,
    };
  } catch (error) {
    if (error.code === 410) {
      console.log("SyncToken expired, doing full sync");
      return getChangedEvents(null);
    }
    console.error("Failed to get changes:", error);
    return { ok: false, error: error.message };
  }
}

async function stopWatching(channelId, resourceId) {
  try {
    await calendar.channels.stop({
      resource: { id: channelId, resourceId },
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to stop watching:", error);
    return { ok: false, error: error.message };
  }
}

module.exports = {
  exportEvent,
  updateEvent,
  deleteEvent,
  watchCalendar,
  getChangedEvents,
  stopWatching,
};
