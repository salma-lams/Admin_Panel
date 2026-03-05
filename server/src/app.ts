import express from "express";
import cors from "cors";
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

  // Security
  app.use(helmet());

  // Structured Logging
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  }));

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      exposedHeaders: ["set-cookie"],
    })
  );
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
