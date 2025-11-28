import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";
import env from "@/config/env";
import authRoutes from "@/routes/authRoutes";
import userRoutes from "@/routes/userRoutes";
import { errorHandler } from "@/middleware/errorHandler";
import { swaggerSpec } from "@/config/swagger";
import quotationRoutes from "@/routes/quotationRoutes";
import serviceRoutes from "@/routes/serviceRoutes";
import portfolioRoutes from "@/routes/portfolioRoutes";
import projectRoutes from "@/routes/projectRoutes";
import uploadRoutes from "@/routes/uploadRoutes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-lang"],
  })
);
app.use(morgan("dev"));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Upload routes should be before express.json() to handle multipart/form-data
app.use("/api/upload", uploadRoutes);

// JSON body parser (after upload routes)
app.use(express.json());

// Other API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/projects", projectRoutes);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use(errorHandler);

export default app;
