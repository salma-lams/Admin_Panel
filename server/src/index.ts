import mongoose from "mongoose";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedInitialData } from "./config/seed";
import { createApp } from "./app";
import { logger } from "./utils/logger";

const app = createApp();

// For serverless environments like Vercel, we must ensure the DB connects on the first request
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await connectDatabase();
      }
      dbInitialized = true;
    } catch (err) {
      logger.error("DB connection error in serverless middleware", err);
    }
  }
  next();
});

// Only start the standalone server if we are NOT running in Vercel
if (!process.env.VERCEL) {
  async function bootstrap(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        await connectDatabase();
      }
      await seedInitialData();

      const server = app.listen(env.PORT, () => {
        logger.info(`✅ API established on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });

      // Graceful Shutdown Logic
      const shutdown = async (signal: string) => {
        logger.info(`⚠️  ${signal} signal received. Starting graceful shutdown...`);

        server.close(async () => {
          logger.info("🛑 HTTP server closed.");

          try {
            await mongoose.connection.close();
            logger.info("🔌 MongoDB connection closed.");
            process.exit(0);
          } catch (err) {
            logger.error("❌ Error while closing MongoDB:", err);
            process.exit(1);
          }
        });

        setTimeout(() => {
          logger.error("🔴 Could not close connections in time, forcefully shutting down");
          process.exit(1);
        }, 10000);
      };

      process.on("SIGTERM", () => shutdown("SIGTERM"));
      process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
      logger.error("💥 Failed to bootstrap application:", error);
      process.exit(1);
    }
  }

  bootstrap();
}

// Export the app for Vercel Serverless
export default app;
