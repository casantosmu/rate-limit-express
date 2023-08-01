import { type Request, type Response, type NextFunction } from "express";

type AuthRequest<T> = Request & {
  auth?: T;
};

type AuthRequestHandler<T> = (
  req: AuthRequest<T>,
  res: Response,
  next: NextFunction,
) => void;

type UuidAuthPayload = { uuid: string };

export type UuidAuthRequest = AuthRequest<UuidAuthPayload>;

export type UuidAuthRequestHandler = AuthRequestHandler<UuidAuthPayload>;
