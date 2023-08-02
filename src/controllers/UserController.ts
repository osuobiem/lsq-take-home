import {NextFunction, Request, Response} from "express";
import {compareSync, hashSync} from "bcrypt";
import {ACCESS_TOKEN_LENGTH, PASSWORD_SALT_ROUNDS} from "../utils/constants";
import UserRepository from "../repositories/UserRepository";
import AppError from "../utils/AppError";
import {ErrorMessage, HttpStatus} from "../utils/enums";
import {User} from "../types/models";
import {randomBytes} from "crypto";

class UserController {
  /**
   * User signup action
   */
  static signup = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;
    const userRepository = new UserRepository();

    try {
      const hashedPassword = hashSync(password, PASSWORD_SALT_ROUNDS);

      const attemptUserCreation = await userRepository.create({
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

  /**
   * User login action
   */
  static login = async (
    user: User,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {password} = req.body;

    try {
      // Check password
      if (!compareSync(password, user.password)) {
        throw new AppError(
          ErrorMessage.INVALID_CREDENTIALS,
          HttpStatus.BAD_REQUEST
        );
      }

      const userRepository = new UserRepository();

      // Genetate access token and update user
      const accessToken = randomBytes(ACCESS_TOKEN_LENGTH).toString("base64");

      const updateUser = await userRepository.update(user.id as number, {
        ...user,
        accessToken,
      });

      if (!updateUser) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      return res.status(HttpStatus.OK).json({
        message: "Login Successful",
        data: {
          name: user.name,
          email: user.email,
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
