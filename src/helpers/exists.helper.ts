import exists from "../middleware/exists.middleware";
import UserRepository from "../repositories/UserRepository";
import {NextFunction, Request, Response} from "express";
import {ErrorMessage} from "../utils/enums";

/**
 * Helper function that checks if an email does not exist
 */
export const emailShouldNotExist = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  exists(
    {
      repository: new UserRepository(),
      attribute: "email",
      value: req.body.email,
      shouldExist: false,
    },
    req,
    res,
    next
  );

/**
 * Helper function that checks if an email exists and passes down the user object
 */
export const emailShouldExist = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  exists(
    {
      repository: new UserRepository(),
      attribute: "email",
      value: req.body.email,
      shouldExist: true,
      passData: true,
      customMessage: ErrorMessage.INVALID_CREDENTIALS,
    },
    req,
    res,
    next
  );
