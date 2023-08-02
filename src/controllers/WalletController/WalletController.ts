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
      const updateWallet = await walletRepository.updateBalance(
        wallet.id,
        newBalance
      );

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
        await walletRepository.updateBalance(wallet.id, wallet.balance);

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
  static transfer = async (req: Request, res: Response, next: NextFunction) => {
    const {amount, data, user} = req.body;
    const toUser = data;

    const senderWalletRepository = new WalletRepository();
    const receiverWalletRepository = new WalletRepository();
    const transactionRepository = new TransactionRepository();

    try {
      // Check if sender and receiver are the same
      if (user.id === toUser.id) {
        throw new AppError(
          ErrorMessage.INVALID_TRANSFER,
          HttpStatus.BAD_REQUEST
        );
      }

      const senderWallet: Wallet = await senderWalletRepository.find({
        user_id: user.id,
      });

      const receiverWallet: Wallet = await receiverWalletRepository.find({
        user_id: toUser.id,
      });

      if (!senderWallet || !receiverWallet) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      // Check if wallet has enough funds
      if (senderWallet.balance < amount) {
        throw new AppError(
          ErrorMessage.INSUFFICIENT_FUNDS,
          HttpStatus.BAD_REQUEST
        );
      }

      // Deduct from sender's wallet balance
      const senderBalance = senderWallet.balance - amount;
      const updateSender = await senderWalletRepository.updateBalance(
        senderWallet.id,
        senderBalance
      );

      if (!updateSender) {
        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      // Increment receiver's wallet balance
      const receiverBalance = receiverWallet.balance + amount;
      const updateReceiver = await receiverWalletRepository.updateBalance(
        receiverWallet.id,
        receiverBalance
      );

      // Rollback deduction
      if (!updateReceiver) {
        senderWallet.balance += amount;
        await senderWalletRepository.updateBalance(
          senderWallet.id,
          senderWallet.balance
        );

        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      // Create transfer transaction
      const createTransaction = await transactionRepository.create({
        type: TransactionType.TRANSFER,
        amount,
        from_wallet: senderWallet.id,
        to_wallet: receiverWallet.id,
      });

      // Rollback entire transaction
      if (!createTransaction || createTransaction[0] === 0) {
        senderWallet.balance += amount;
        await senderWalletRepository.updateBalance(
          senderWallet.id,
          senderWallet.balance
        );

        receiverWallet.balance -= amount;
        await receiverWalletRepository.updateBalance(
          receiverWallet.id,
          receiverWallet.balance
        );

        throw new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR);
      }

      res.status(HttpStatus.OK).json({
        message: "Transfer successful",
        data: {
          balance: senderBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  };

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
