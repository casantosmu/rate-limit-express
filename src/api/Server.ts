import { type AddressInfo } from "net";
import {
  type Server as HttpServer,
  createServer,
  type RequestListener,
} from "http";
import { type Logger } from "../lib/logger/types";

type ServerConfigs = {
  port: number;
};

export class Server {
  private server: HttpServer | undefined;

  constructor(
    private readonly logger: Logger,
    private readonly configs: ServerConfigs,
  ) {}

  readonly start = async (app: RequestListener) =>
    new Promise<AddressInfo>((resolve, reject) => {
      this.server = createServer(app).listen(this.configs.port, () => {
        const info = this.server?.address() as AddressInfo;
        this.logger.info(`Server is running at http://localhost:${info.port}`);
        resolve(info);
      });

      this.server.once("error", (error) => {
        this.logger.error("Error starting server");
        reject(error);
      });
    });

  readonly stop = async () =>
    new Promise<void>((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.logger.info("HTTP server closed");
          resolve();
        });
        return;
      }

      resolve();
    });
}

export default Server;
