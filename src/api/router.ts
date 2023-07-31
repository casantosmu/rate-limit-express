import { Router as expressRouter } from "express";
import { getPing } from "./controllers";

export const router = expressRouter();

router.get("/ping", getPing);
