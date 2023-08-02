import {Request, Response, NextFunction} from "express";
import WalletController from "./WalletController";
import db from "../../config/db";
import {knex} from "../../__mocks__/db.mock";
import {mockDBUsers} from "../../__mocks__/user.mock";
import {ErrorMessage, HttpStatus, TransactionType} from "../../utils/enums";
import WalletRepository from "../../repositories/WalletRepository";
import {mockDBWallets} from "../../__mocks__/wallet.mock";
import AppError from "../../utils/AppError";
import TransactionRepository from "../../repositories/TransactionRepository";

process.env.NODE_ENV = "test";

jest.mock("../../config/db.ts");

const mockedDBConfig = jest.mocked(db);

describe("WalletController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  const mockDBUser1 = mockDBUsers[0];
  const mockDBUser2 = mockDBUsers[1];

  const mockDBWallet1 = mockDBWallets[0];
  const mockDBWallet2 = mockDBWallets[1];

  const mockCreateTransaction = jest.spyOn(
    TransactionRepository.prototype,
    "create"
  );
  const mockUpdateWallet = jest.spyOn(WalletRepository.prototype, "update");

  beforeAll(() => {
    mockedDBConfig.mockReturnValue(knex as any);
  });

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as any;

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Fund wallet
  describe("Fund wallet", () => {
    beforeEach(() => {
      req = {
        body: {
          amount: 7250,
          data: mockDBUser1,
        },
      } as Request;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should successfully fund the wallet", async () => {
      mockUpdateWallet.mockResolvedValueOnce(1);
      mockCreateTransaction.mockResolvedValueOnce([1]);

      await WalletController.fund(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance + req.body.amount,
      });

      // Test for transaction creation
      expect(mockCreateTransaction).toHaveBeenCalledWith({
        amount: req.body.amount,
        type: TransactionType.FUND,
        from_wallet: null,
        to_wallet: mockDBWallet1.id,
      });

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Wallet funded successfully",
        data: {
          balance: mockDBWallet1.balance + req.body.amount,
        },
      });
    });

    test("should throw an error if funding is unsuccessful", async () => {
      mockUpdateWallet.mockResolvedValueOnce(0);

      await WalletController.fund(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance + req.body.amount,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVER_ERROR);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR)
      );
    });
  });

  // Transfer to another user's wallet
  describe("Transfer from wallet", () => {
    beforeEach(() => {
      req = {
        body: {
          amount: 7250,
          data: mockDBUser1,
        },
      } as Request;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should successfully transfer from wallet", async () => {
      req.body.to_user = 2;

      mockUpdateWallet.mockResolvedValueOnce(1);
      mockCreateTransaction.mockResolvedValueOnce([1]);

      await WalletController.transfer(req, res, next);

      // Test for sender's wallet balance deduction
      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance - req.body.amount,
      });

      // Test for receiver's wallet balance addition
      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet2.id, {
        ...mockDBWallet2,
        balance: mockDBWallet2.balance + req.body.amount,
      });

      // Test for transaction creation
      expect(mockCreateTransaction).toHaveBeenCalledWith({
        amount: req.body.amount,
        type: TransactionType.TRANSFER,
        from_wallet: mockDBWallet1.id,
        to_wallet: mockDBWallet2.id,
      });

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transfer successful",
        data: {
          balance: mockDBWallet1.balance - req.body.amount,
        },
      });
    });

    test("should throw an error if wallet funds is insufficient", async () => {
      req.body.amount = 500000;
      req.body.to_user = 2;

      await WalletController.transfer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST)
      );
    });

    test("should throw an error if the transfer is attempted on the same wallet", async () => {
      req.body.to_user = 1;

      await WalletController.transfer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.INVALID_TRANSFER, HttpStatus.BAD_REQUEST)
      );
    });

    test("should throw an error if transfer is unsuccessful", async () => {
      req.body.to_user = 2;

      mockUpdateWallet.mockResolvedValueOnce(0);

      await WalletController.transfer(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance + req.body.amount,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVER_ERROR);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR)
      );
    });
  });

  // Withdraw from wallet
  describe("Withdraw from wallet", () => {
    beforeEach(() => {
      req = {
        body: {
          amount: 12000,
          data: mockDBUser1,
        },
      } as Request;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should successfully withdraw from wallet", async () => {
      mockUpdateWallet.mockResolvedValueOnce(1);
      mockCreateTransaction.mockResolvedValueOnce([1]);

      await WalletController.withdraw(req, res, next);

      // Test for sender's wallet balance deduction
      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance - req.body.amount,
      });

      // Test for transaction creation
      expect(mockCreateTransaction).toHaveBeenCalledWith({
        amount: req.body.amount,
        type: TransactionType.WITHDRAW,
        from_wallet: mockDBWallet1.id,
        to_wallet: null,
      });

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Withdrawal successful",
        data: {
          balance: mockDBWallet1.balance - req.body.amount,
        },
      });
    });

    test("should throw an error if wallet funds is insufficient", async () => {
      req.body.amount = 869000;

      await WalletController.withdraw(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST)
      );
    });

    test("should throw an error if withdraw is unsuccessful", async () => {
      mockUpdateWallet.mockResolvedValueOnce(0);

      await WalletController.transfer(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet1.id, {
        ...mockDBWallet1,
        balance: mockDBWallet1.balance - req.body.amount,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVER_ERROR);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR)
      );
    });
  });
});
