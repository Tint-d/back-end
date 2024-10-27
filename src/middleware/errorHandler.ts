import { Request, Response, NextFunction } from "express";
import {
  AppError,
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from "../util/AppError";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof BadRequest) {
    console.log(error.message);
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof NotFound) {
    console.log(error.message);
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof Unauthorized) {
    console.log(error.message, "in error handler");
    return res.status(error.getStatusCode()).json({ message: error.message });
  }
  if (error instanceof Forbidden) {
    console.log(error.message, "in error handler");
    return res.status(error.getStatusCode()).json({ message: error.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
