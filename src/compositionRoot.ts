import { env } from "./configs/env";
import Server from "./api/Server";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";

export const logger = console;

export const server = new Server(logger, {
  port: env.serverPort,
});

const errorMiddlewareHandler = errorMiddleware(console);
export const provideErrorMiddleware = () => errorMiddlewareHandler;
