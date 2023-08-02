import {Router} from "express";
import UserValidator from "./validators/UserValidator";
import {emailShouldExist, emailShouldNotExist} from "./helpers/exists.helper";
import UserController from "./controllers/UserController";

const router = Router();

// User login
router.post(
  "/api/login",
  UserValidator.login,
  emailShouldExist,
  UserController.login
);

// User signup
router.post(
  "/api/user",
  UserValidator.signup,
  emailShouldNotExist,
  UserController.signup
);

export default router;
