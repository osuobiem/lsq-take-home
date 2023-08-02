import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";
import {HttpStatus} from "../utils/enums";
import errorMiddleware from "./error.middleware";
import BaseRepository from "../repositories/BaseRepostory";

type ExistOptions = {
  repository: BaseRepository;
  attribute: string;
  value: string | number;
  shouldExist?: boolean;
  passData?: boolean;
  customMessage?: string;
};

const exists = async (
  options: ExistOptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    repository,
    attribute,
    value,
    shouldExist = true,
    passData = false,
    customMessage,
  } = options;

  const errorPart =
    customMessage ?? shouldExist ? "doesn't exist" : "already exists";
  const errorMessage = `The '${attribute}' ${errorPart}`;

  try {
    const data = await repository.find({[attribute]: value});

    if ((shouldExist && !data) || (!shouldExist && data)) {
      throw new AppError(errorMessage, HttpStatus.BAD_REQUEST);
    }

    if (passData) req.body.user = data;

    next();
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};

export default exists;
