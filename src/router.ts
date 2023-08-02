import {Router} from "express";
import UserValidator from "./validators/UserValidator";
import {emailShouldNotExist} from "./helpers/exists.helper";
import UserController from "./controllers/UserController";

const router = Router();

// User signup
router.post(
  "/user",
  UserValidator.signup,
  emailShouldNotExist,
  UserController.signup
);

export default router;
