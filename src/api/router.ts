import { Router as expressRouter } from "express";
import { getPublic, getProtected } from "./controllers";
import { provideUuidAuthMiddleware } from "../compositionRoot";

export const router = expressRouter();

router.get("/public", getPublic);

router.get("/protected", provideUuidAuthMiddleware(), getProtected);
