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
import expenseRoutes from "@/routes/expenseRoutes";
import incomeRoutes from "@/routes/incomeRoutes";
import notificationRoutes from "@/routes/notificationRoutes";
import uploadRoutes from "@/routes/uploadRoutes";
import sectionRoutes from "@/routes/sectionRoutes";
import contactRoutes from "@/routes/contactRoutes";
import articleRoutes from "@/routes/articleRoutes";

const app = express();

// Configure helmet to allow cross-origin images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-lang"],
  })
);
app.use(morgan("dev"));

// Serve static files from uploads directory with CORS headers
app.use(
  "/api/uploads",
  (req, res, next) => {
    // Set CORS headers for all origins to allow cross-origin image loading
    const origin = req.headers.origin;
    if (origin && env.corsOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

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
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/articles", articleRoutes);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use(errorHandler);

export default app;
