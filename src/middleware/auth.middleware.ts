import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";
import {ErrorMessage, HttpStatus} from "../utils/enums";
import UserRepository from "../repositories/UserRepository";
import errorMiddleware from "./error.middleware";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const {authorization} = req.headers;

  // Check if token is in the request header
  if (!authorization) {
    throw new AppError(ErrorMessage.TOKEN_IS_REQUIRED, HttpStatus.UNAUTHORIZED);
  }

  // Verify the token
  try {
    const data = await new UserRepository().find({accessToken: authorization});

    if (!data) {
      throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    next();
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};

export default verifyToken;
