/* eslint-env node */
require("dotenv").config();
const mongoose = require("mongoose");
const { MONGODB_ENDPOINT } = require("../config");

const UserObject = require("../models/user");
const AdminObject = require("../models/admin");
const EventObject = require("../models/event");
const VenueObject = require("../models/venue");

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_ENDPOINT);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await UserObject.deleteMany({});
    await AdminObject.deleteMany({});
    await EventObject.deleteMany({});
    await VenueObject.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create test users
    const users = await UserObject.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        role: "user",
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create admin
    const admin = await AdminObject.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Created admin user");

    const venues = await VenueObject.create([
      {
        name: "Convention Center Paris",
        address: "123 Main Street",
        city: "Paris",
        country: "France",
        capacity: 500,
        amenities: ["WiFi", "Projector", "Catering", "Parking"],
        image_url: "",
        owner_id: users[0]._id,
        owner_name: users[0].name,
      },
      {
        name: "Tech Hub Lyon",
        address: "456 Innovation Ave",
        city: "Lyon",
        country: "France",
        capacity: 50,
        amenities: ["WiFi", "Projector", "Whiteboard"],
        owner_id: users[1]._id,
        owner_name: users[1].name,
      },
      {
        name: "The Startup Loft",
        address: "789 Startup Lane",
        city: "Marseille",
        country: "France",
        capacity: 100,
        amenities: ["WiFi", "Bar", "Outdoor Terrace"],
        owner_id: users[0]._id,
        owner_name: users[0].name,
      },
      {
        name: "University Auditorium",
        address: "321 Academic Way",
        city: "Toulouse",
        country: "France",
        capacity: 300,
        amenities: ["WiFi", "Projector", "Microphone", "Recording"],
        owner_id: users[2]._id,
        owner_name: users[2].name,
      },
    ]);
    console.log(`✅ Created ${venues.length} venues`);

    // Create sample events
    const events = await EventObject.create([
      {
        title: "Tech Conference 2026",
        description: "Annual technology conference featuring the latest innovations in AI, Web3, and Cloud Computing.",
        start_date: new Date("2026-01-15T09:00:00"),
        end_date: new Date("2026-01-15T18:00:00"),
        venue_name: venues[0].name,
        address: venues[0].address,
        city: venues[0].city,
        country: venues[0].country,
        capacity: venues[0].capacity,
        venue_id: venues[0]._id,
        available_spots: venues[0].capacity,
        price: 0,
        currency: "EUR",
        status: "published",
        category: "conference",
        organizer_id: users[0]._id,
        organizer_name: users[0].name,
        organizer_email: users[0].email,
        registration_deadline: new Date("2026-03-10T23:59:59"),
      },
      {
        title: "JavaScript Workshop",
        description: "Hands-on workshop covering modern JavaScript frameworks including React, Vue, and Next.js.",
        start_date: new Date("2026-02-20T14:00:00"),
        end_date: new Date("2026-02-20T17:00:00"),
        venue_name: venues[1].name,
        address: venues[1].address,
        city: venues[1].city,
        country: venues[1].country,
        capacity: venues[1].capacity,
        venue_id: venues[1]._id,
        available_spots: venues[1].capacity,
        price: 49.99,
        currency: "EUR",
        status: "published",
        category: "workshop",
        organizer_id: users[1]._id,
        organizer_name: users[1].name,
        organizer_email: users[1].email,
        requires_approval: false,
      },
      {
        title: "Startup Networking Night",
        description:
          "Meet fellow entrepreneurs, investors, and startup enthusiasts in a casual networking environment.",
        start_date: new Date("2026-02-01T19:00:00"),
        end_date: new Date("2026-02-01T22:00:00"),
        venue_name: venues[2].name,
        address: venues[2].address,
        city: venues[2].city,
        country: venues[2].country,
        capacity: venues[2].capacity,
        venue_id: venues[2]._id,
        available_spots: venues[2].capacity,
        price: 0,
        currency: "EUR",
        status: "published",
        category: "networking",
        organizer_id: users[0]._id,
        organizer_name: users[0].name,
        organizer_email: users[0].email,
      },
      {
        title: "AI & Machine Learning Seminar",
        description: "Expert-led seminar on the latest developments in artificial intelligence and machine learning.",
        start_date: new Date("2026-04-10T10:00:00"),
        end_date: new Date("2026-04-10T16:00:00"),
        venue_name: venues[3].name,
        address: venues[3].address,
        city: venues[3].city,
        country: venues[3].country,
        capacity: venues[3].capacity,
        venue_id: venues[3]._id,
        available_spots: venues[3].capacity,
        price: 29.99,
        currency: "EUR",
        status: "published",
        category: "seminar",
        organizer_id: users[2]._id,
        organizer_name: users[2].name,
        organizer_email: users[2].email,
        registration_deadline: new Date("2026-04-05T23:59:59"),
      },
      {
        title: "Draft Event - Not Published",
        description: "This event is still in draft mode and won't appear in public listings.",
        start_date: new Date("2026-05-01T10:00:00"),
        venue_name: venues[0].name,
        address: venues[0].address,
        city: venues[0].city,
        country: venues[0].country,
        capacity: venues[0].capacity,
        venue_id: venues[0]._id,
        available_spots: venues[0].capacity,
        price: 0,
        currency: "EUR",
        status: "draft",
        category: "other",
        organizer_id: users[1]._id,
        organizer_name: users[1].name,
        organizer_email: users[1].email,
      },
      // Bad events with "not-good" in title - for cleanup script practice
      {
        title: "Test Event not-good data quality",
        description: "This event has bad data and should be cleaned up.",
        start_date: new Date("2026-03-20T10:00:00"),
        venue_name: venues[0].name,
        address: venues[0].address,
        city: venues[0].city,
        country: venues[0].country,
        capacity: venues[0].capacity,
        venue_id: venues[0]._id,
        available_spots: venues[0].capacity,
        price: 0,
        currency: "EUR",
        status: "published",
        category: "other",
        organizer_id: users[0]._id,
        organizer_name: users[0].name,
        organizer_email: users[0].email,
      },
      {
        title: "not-good Spam Event Here",
        description: "Another low-quality event that needs cleanup.",
        start_date: new Date("2026-04-15T14:00:00"),
        venue_name: venues[1].name,
        address: venues[1].address,
        city: venues[1].city,
        country: venues[1].country,
        capacity: venues[1].capacity,
        venue_id: venues[1]._id,
        available_spots: venues[1].capacity,
        price: 0,
        currency: "EUR",
        status: "published",
        category: "other",
        organizer_id: users[1]._id,
        organizer_name: users[1].name,
        organizer_email: users[1].email,
      },
      {
        title: "Workshop with not-good title format",
        description: "This workshop title doesn't follow our standards.",
        start_date: new Date("2026-05-05T09:00:00"),
        venue_name: venues[2].name,
        address: venues[2].address,
        city: venues[2].city,
        country: venues[2].country,
        capacity: venues[2].capacity,
        venue_id: venues[2]._id,
        available_spots: venues[2].capacity,
        price: 10,
        currency: "EUR",
        status: "published",
        category: "workshop",
        organizer_id: users[2]._id,
        organizer_name: users[2].name,
        organizer_email: users[2].email,
      },
    ]);
    console.log(`✅ Created ${events.length} events`);

    console.log("\n🎉 Seed completed successfully!\n");
    console.log("📧 Test Credentials:");
    console.log("   User: john@example.com / password123");
    console.log("   User: jane@example.com / password123");
    console.log("   User: bob@example.com / password123");
    console.log("   Admin: admin@example.com / admin123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
