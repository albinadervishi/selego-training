const { google } = require("googleapis");
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = require("../config");

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

    console.log(`Event exported to Google Calendar: ${response.data.id}`);

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

    console.log(`Google Calendar event updated: ${googleEventId}`);
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

    console.log(`Google Calendar event deleted: ${googleEventId}`);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting event in Google Calendar:", error.message);
    return { ok: false, error: error.message };
  }
}

module.exports = {
  exportEvent,
  updateEvent,
  deleteEvent,
};
