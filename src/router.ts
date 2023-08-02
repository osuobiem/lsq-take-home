import {Router} from "express";
import UserValidator from "./validators/UserValidator";
import {emailShouldExist, emailShouldNotExist} from "./helpers/exists.helper";
import UserController from "./controllers/UserController/UserController";
import verifyToken from "./middleware/auth.middleware";
import WalletValidator from "./validators/WalletValidator";
import WalletController from "./controllers/WalletController/WalletController";

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

// Fund wallet
router.put(
  "/api/wallet/fund",
  verifyToken,
  WalletValidator.fund,
  WalletController.fund
);

export default router;
