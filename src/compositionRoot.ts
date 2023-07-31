import { env } from "./configs/env";
import Server from "./api/Server";

export const logger = console;

export const server = new Server(logger, {
  port: env.serverPort,
});
