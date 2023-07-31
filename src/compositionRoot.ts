import { env } from "./configs/env";
import { Server } from "./api/Server";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";
import { uuidAuthMiddleware } from "./api/middlewares/authMiddleware";

export const logger = console;

export const server = new Server(logger, {
  port: env.serverPort,
});

const uuidAuthMiddlewareHandler = uuidAuthMiddleware(env.uuidAuthToken);
export const provideUuidAuthMiddleware = () => uuidAuthMiddlewareHandler;

const errorMiddlewareHandler = errorMiddleware(console);
export const provideErrorMiddleware = () => errorMiddlewareHandler;
