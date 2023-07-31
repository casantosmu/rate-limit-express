import axios from "axios";
import { type AddressInfo } from "net";
import { server } from "../../src/compositionRoot";
import { app } from "../../src/api/app";

// This variable acts as a cache to store server information.
let serverInfo: AddressInfo | undefined;

const request = axios.create();

request.interceptors.request.use(async (req) => {
  if (!serverInfo) {
    serverInfo = await server.start(app);
  }

  // During testing, SERVER_PORT is set to 0, which allows selecting an available port automatically.
  // Need to setup the server first to get the assigned port
  req.baseURL = `http://localhost:${serverInfo.port}`;

  return req;
});

request.interceptors.response.use(
  (response) => response,
  // Prevent http client from throwing an Error
  async (error) => Promise.resolve(error.response),
);

afterAll(async () => {
  await server.stop();
});

export default request;
