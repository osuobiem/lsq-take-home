import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";
import {ErrorMessage, HttpStatus} from "../utils/enums";

export default (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({error: error.message});
  }

  res.status(HttpStatus.SERVER_ERROR).json({error: ErrorMessage.SERVER_ERROR});
};
