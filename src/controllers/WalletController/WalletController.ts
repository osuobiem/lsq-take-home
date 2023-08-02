import {NextFunction, Request, Response} from "express";
import WalletRepository from "../../repositories/WalletRepository";
import AppError from "../../utils/AppError";
import {ErrorMessage, HttpStatus, TransactionType} from "../../utils/enums";
import {Wallet} from "../../types/models";
import TransactionRepository from "../../repositories/TransactionRepository";

class WalletController {
  /**
   * Fund wallet
   */
  static fund = async (req: Request, res: Response, next: NextFunction) => {
    const {amount, user} = req.body;

    const walletRepository = new WalletRepository();
    const transactionRepository = new TransactionRepository();

    try {
      const wallet: Wallet = await walletRepository.find({user_id: user.id});

      if (!wallet) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      // Increment wallet balance
      const newBalance = wallet.balance + amount;
      const updateWallet = await walletRepository.update(wallet.id, {
        ...wallet,
        balance: newBalance,
      });

      if (!updateWallet) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      // Create fund transaction
      const createTransaction = await transactionRepository.create({
        type: TransactionType.FUND,
        amount,
        to_wallet: wallet.id,
      });

      // Rollback wallet update
      if (!createTransaction || createTransaction[0] === 0) {
        wallet.balance -= amount;
        await walletRepository.update(wallet.id, {
          ...wallet,
        });

        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      res.status(HttpStatus.OK).json({
        message: "Wallet funded successfully",
        data: {
          balance: newBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Transfer to another user's wallet
   */
  static transfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  /**
   * Withdraw from wallet
   */
  static withdraw = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}

export default WalletController;
