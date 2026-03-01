import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedInitialData } from "./config/seed";
import { createApp } from "./app";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await seedInitialData();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
