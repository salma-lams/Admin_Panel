import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { usersRouter } from "./routes/users.routes";
import { productsRouter } from "./routes/products.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { csrfProtection } from "./middleware/csrf";

import expressWinston from "express-winston";
import mongoose from "mongoose";
import { logger } from "./utils/logger";

export function createApp() {
  const app = express();

  // CORS MUST come first — before helmet, before any other middleware
  // Otherwise Helmet's security headers can override CORS headers
  const STATIC_ORIGINS = [
    env.CLIENT_ORIGIN,
    "https://admin-panel-seven-mauve.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean) as string[];

  // Regex to allow any Vercel preview deployment for admin-panel project
  const VERCEL_PREVIEW_REGEX = /^https:\/\/admin-panel-[a-z0-9-]+\.vercel\.app$/;

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (STATIC_ORIGINS.includes(origin) || VERCEL_PREVIEW_REGEX.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked origin: ${origin}`));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  // Handle CORS (this middleware automatically handles OPTIONS preflight)
  app.use(cors(corsOptions));

  // Security (after CORS so it doesn't block cross-origin headers)
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // Structured Logging
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  }));

  app.use(express.json());
  app.use(cookieParser());
  app.use(csrfProtection);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Enhanced Health check
  const healthHandler = (_req: any, res: any) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({
      status: "ok",
      service: "admin-panel-api",
      uptime: process.uptime(),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  };

  app.get("/health", healthHandler);
  app.get("/api/health", healthHandler);

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/dashboard", dashboardRouter);

  // 404 & error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
