import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";
import {HttpStatus} from "../utils/enums";
import errorMiddleware from "./error.middleware";
import {Repository} from "../types/repositories";
import BaseRepository from "../repositories/BaseRepostory";

type ExistOptions = {
  repository: BaseRepository;
  attribute: string;
  value: string | number;
  shouldExist?: boolean;
  passData?: boolean;
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
  } = options;

  const errorPart = shouldExist ? "doesn't exist" : "already exists";
  const errorMessage = `The '${attribute}' ${errorPart}`;

  try {
    const data = await repository.get({[attribute]: value});

    if (
      (shouldExist && data.length! > 0) ||
      (!shouldExist && data.length > 0)
    ) {
      throw new AppError(errorMessage, HttpStatus.BAD_REQUEST);
    }

    passData ? next(data[0]) : next();
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};

export default exists;
