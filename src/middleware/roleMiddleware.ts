import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { Forbidden, Unauthorized } from "../util/AppError";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as IUser;

  if (user.role === "admin") {
    return next();
  }
  throw new Forbidden("Access denied: Admins only");
};

export const isTraderOrHigher = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as IUser;
  if (user.role === "admin" || user.role === "trader") {
    return next();
  }
  throw new Unauthorized("Access denied: Traders and Admins only");
};

export const canViewPublicChannel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as IUser;
  if (
    user.role === "admin" ||
    user.role === "trader" ||
    user.role === "guest"
  ) {
    return next();
  }
  throw new Unauthorized(
    "Access denied: You do not have permission to view this channel"
  );
};
