import "dotenv/config";
import bcrypt from "bcryptjs";
import env from "@/config/env";
import { connectDatabase } from "@/config/database";
import { User } from "@/models/User";

const seedAdmin = async () => {
  try {
    await connectDatabase();

    const existing = await User.findOne({ email: env.seedAdminEmail });
    if (existing) {
      console.log("Admin already exists with email:", env.seedAdminEmail);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(env.seedAdminPassword, 12);

    await User.create({
      name: env.seedAdminName,
      email: env.seedAdminEmail,
      phone: env.seedAdminPhone,
      companyName: env.seedAdminCompany,
      role: "admin",
      password: hashedPassword,
    });

    console.log("Admin seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
