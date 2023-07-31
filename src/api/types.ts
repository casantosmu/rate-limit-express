import { type Request, type Response, type NextFunction } from "express";

export type UuidAuthPayload = { uuid: string };

export type AuthRequest<T> = Request & {
  auth?: T;
};
export type AuthRequestHandler<T> = (
  req: AuthRequest<T>,
  res: Response,
  next: NextFunction,
) => void;
