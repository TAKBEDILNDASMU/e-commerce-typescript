import env from "./env";
import { disconnectedFromDb } from "./app/database";
import { web } from "./app/web";
import { logger } from "./app/logger";

web.listen(env.PORT, () => {
  logger.info(`Server up and running on port ${env.PORT}`);
});

// disconnected from db
process.on("SIGINT", async () => {
  await disconnectedFromDb();
  process.exit(0);
});
