/* eslint-disable no-undef */
const ENVIRONMENT = process.env.ENVIRONMENT || "development";
const PORT = process.env.PORT || 8080;
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const SECRET = process.env.SECRET || "not-so-secret";
const APP_URL = process.env.APP_URL || "http://localhost:3000";
const ADMIN_URL = process.env.ADMIN_URL || "http://localhost:3001";
const SENTRY_DSN = process.env.SENTRY_DSN || "";

const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_ACCESSKEYID = process.env.S3_ACCESSKEYID || "";
const S3_SECRETACCESSKEY = process.env.S3_SECRETACCESSKEY || "";

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";

const BREVO_KEY = process.env.BREVO_KEY || "";

const CRON_SECRET = process.env.CRON_SECRET || "";
const API_URL = process.env.API_URL || "";

const CONFIG = {
  ENVIRONMENT,
  PORT,
  MONGODB_ENDPOINT,
  SECRET,
  APP_URL,
  ADMIN_URL,
  SENTRY_DSN,
  S3_ENDPOINT,
  S3_ACCESSKEYID,
  S3_SECRETACCESSKEY,
  BREVO_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CALENDAR_ID,
  CRON_SECRET,
  API_URL,
};

if (ENVIRONMENT === "development") console.log(CONFIG);

module.exports = CONFIG;
