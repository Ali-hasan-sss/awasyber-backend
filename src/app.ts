import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import env from "@/config/env";
import authRoutes from "@/routes/authRoutes";
import userRoutes from "@/routes/userRoutes";
import { errorHandler } from "@/middleware/errorHandler";
import { swaggerSpec } from "@/config/swagger";
import quotationRoutes from "@/routes/quotationRoutes";
import serviceRoutes from "@/routes/serviceRoutes";

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
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/services", serviceRoutes);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use(errorHandler);

export default app;
