const { sendEmail } = require("./brevo");

async function notifyEventChange(event, changeType) {
  try {
    if (!event.organizer_email) {
      console.log("No organizer email for event:", event._id);
      return;
    }

    const subjects = {
      created: `Event Created: ${event.title}`,
      updated: `Event Updated: ${event.title}`,
      published: `Event Published: ${event.title}`,
      cancelled: `Event Cancelled: ${event.title}`,
      new_attendee: `New Registration: ${event.title}`,
    };

    const subject = subjects[changeType] || `Event Update: ${event.title}`;

    await sendEmail(
      [{ email: event.organizer_email, name: event.organizer_name }],
      subject,
      `
      <h1>${subject}</h1>
      <p>Hi ${event.organizer_name || "there"},</p>
      <p>Your event "<strong>${event.title}</strong>" has been ${changeType}.</p>
      
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${new Date(event.start_date).toLocaleString()}</li>
        <li><strong>Location:</strong> ${event.venue || "TBA"}, ${event.city || ""}</li>
        <li><strong>Status:</strong> ${event.status}</li>
      </ul>
      
      <p>Log in to manage your event.</p>
      `,
    );
    return { ok: true };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { ok: false, error: error.message };
  }
}

async function sendOwnerReminder(event) {
  try {
    if (!event.organizer_email) return;

    await sendEmail(
      [{ email: event.organizer_email, name: event.organizer_name }],
      `Reminder: ${event.title} starts tomorrow!`,
      `
      <h1>Event Reminder</h1>
      <p>Hi ${event.organizer_name || "there"},</p>
      <p>This is a reminder that your event "<strong>${event.title}</strong>" is starting soon!</p>
      
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${new Date(event.start_date).toLocaleString()}</li>
        <li><strong>Location:</strong> ${event.venue || "TBA"}, ${event.city || ""}</li>
        <li><strong>Registered Attendees:</strong> ${event.capacity - event.available_spots}</li>
      </ul>
      
      <p>Good luck with your event!</p>
      `,
    );

    console.log(`Sent owner reminder for: ${event.title}`);
    return { ok: true };
  } catch (error) {
    console.error("Failed to send owner reminder:", error);
    return { ok: false, error: error.message };
  }
}

module.exports = {
  notifyEventChange,
  sendOwnerReminder,
};
