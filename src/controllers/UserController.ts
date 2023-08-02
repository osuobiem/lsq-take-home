import {NextFunction, Request, Response} from "express";
import {hashSync} from "bcrypt";
import {PASSWORD_SALT_ROUNDS} from "../utils/constants";
import UserRepository from "../repositories/UserRepository";
import AppError from "../utils/AppError";
import {ErrorMessage, HttpStatus} from "../utils/enums";

class UserController {
  /**
   * User signup action
   */
  static signup = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;
    const userRepository = new UserRepository();

    try {
      const hashedPassword = hashSync(password, PASSWORD_SALT_ROUNDS);

      const attemptUserCreation = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      // throw an error if creation fails
      if (!attemptUserCreation) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      return res.status(HttpStatus.CREATED).send("User created successfully");
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
