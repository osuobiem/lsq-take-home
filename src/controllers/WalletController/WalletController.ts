import {NextFunction, Request, Response} from "express";

class WalletController {
  /**
   * Fund wallet
   */
  static fund = async (req: Request, res: Response, next: NextFunction) => {};

  /**
   * Transfer to another user's wallet
   */
  static transfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}

export default WalletController;
