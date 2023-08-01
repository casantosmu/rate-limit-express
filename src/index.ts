import "./configs/env";
import { ioRedisClient, logger, server } from "./compositionRoot";
import { app } from "./api/app";

(async () => {
  try {
    await ioRedisClient.connect();
    await server.start(app);
  } catch (error) {
    logger.error(error);
    await server.stop();
    await ioRedisClient.close();
    process.exitCode = 1;
  }
})();
