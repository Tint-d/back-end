import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { Forbidden, Unauthorized } from "../util/AppError";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Unauthorized("Access denied: No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "object" && "id" in decoded) {
      const user = await User.findById((decoded as JwtPayload).id);
      if (!user) {
        throw new Unauthorized("Access denied: User not found");
      }
      (req as any).user = user;
      next();
    } else {
      throw new Forbidden("Invalid token format");
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
