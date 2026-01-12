require("dotenv").config();
const mongoose = require("mongoose");
const process = require("process");
const { MONGODB_ENDPOINT } = require("../config");

const EventObject = require("../models/event");

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_ENDPOINT);

    const badEvents = await EventObject.find({
      title: { $regex: /not-good/i },
    });

    if (badEvents.length > 0) {
      await EventObject.deleteMany({
        title: { $regex: /not-good/i },
      });
    }
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

cleanup();
