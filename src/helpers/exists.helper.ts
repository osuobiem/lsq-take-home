import exists from "../middleware/exists.middleware";
import UserRepository from "../repositories/UserRepository";
import {NextFunction, Request, Response} from "express";

export const emailExists = (req: Request, res: Response, next: NextFunction) =>
  exists(
    {
      repository: new UserRepository(),
      attribute: "email",
      value: req.body.email,
    },
    req,
    res,
    next
  );
