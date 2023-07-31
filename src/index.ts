import "./configs/env";
import { logger, server } from "./compositionRoot";
import { app } from "./api/app";

(async () => {
  try {
    await server.start(app);
  } catch (error) {
    logger.error(error);
    await server.stop();
    process.exitCode = 1;
  }
})();
