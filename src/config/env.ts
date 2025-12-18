import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || "4000",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/awa_cyber",
  jwtSecret: process.env.JWT_SECRET || "secret",
  adminSetupKey: process.env.ADMIN_SETUP_KEY || "setup-key",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
  seedAdminName: process.env.SEED_ADMIN_NAME || "Super Admin",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@awacyber.com",
  seedAdminPhone: process.env.SEED_ADMIN_PHONE || "+1000000000",
  seedAdminCompany: process.env.SEED_ADMIN_COMPANY || "AWA Cyber",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin123",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:4000",
  // Email configuration
  emailHost: process.env.EMAIL_HOST || "smtp.gmail.com",
  emailPort: Number(process.env.EMAIL_PORT) || 587,
  emailUser: process.env.EMAIL_USER || "",
  emailPassword: process.env.EMAIL_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "info@awacyber.com",
  companyEmail: process.env.COMPANY_EMAIL || "info@awacyber.com",
};

export default env;
