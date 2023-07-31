import { type RequestHandler } from "express";
import { httpStatusCodes } from "../lib/http/httpStatusCodes";

export const getPublic: RequestHandler = (_req, res) => {
  res.sendStatus(httpStatusCodes.ok);
};

export const getProtected: RequestHandler = (_req, res) => {
  res.sendStatus(httpStatusCodes.ok);
};
