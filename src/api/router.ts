import { Router as expressRouter } from "express";
import { getPublic, getProtected } from "./controllers";
import {
  provideIpRateLimitMiddleware,
  provideUuidAuthMiddleware,
  provideUuidRateLimitMiddleware,
} from "../compositionRoot";

export const router = expressRouter();

router.get("/public", provideIpRateLimitMiddleware(), getPublic);

router.get(
  "/protected",
  provideUuidAuthMiddleware(),
  provideUuidRateLimitMiddleware(),
  getProtected,
);
