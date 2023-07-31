import { type RequestHandler } from "express";
import { httpStatusCodes } from "../lib/http/httpStatusCodes";

export const getPing: RequestHandler = (_req, res) => {
  res.sendStatus(httpStatusCodes.ok);
};
