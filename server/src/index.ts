import mongoose from "mongoose";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedInitialData } from "./config/seed";
import { createApp } from "./app";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    await seedInitialData();

    const app = createApp();
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

      // Force close after 10s
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
