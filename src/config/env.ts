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
};

export default env;
