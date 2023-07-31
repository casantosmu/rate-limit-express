import express from "express";
import { router } from "./router";
import { provideErrorMiddleware } from "../compositionRoot";

export const app = express();

app.use("/v1", router);

app.use(provideErrorMiddleware());
