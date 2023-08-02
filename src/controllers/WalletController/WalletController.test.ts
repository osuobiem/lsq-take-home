import {Request, Response, NextFunction} from "express";
import WalletController from "./WalletController";
import db from "../../config/db";
import {knex} from "../../__mocks__/db.mock";
import {mockDBUser} from "../../__mocks__/user.mock";
import {ErrorMessage, HttpStatus} from "../../utils/enums";
import WalletRepository from "../../repositories/WalletRepository";
import {mockDBWallet} from "../../__mocks__/wallet.mock";
import AppError from "../../utils/AppError";

process.env.NODE_ENV = "test";

jest.mock("../../config/db.ts");

const mockedDBConfig = jest.mocked(db);

describe("UserController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  const accessToken = "randomAccessToken";

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

  //Fund wallet
  describe("Fund wallet", () => {
    const mockUpdateWallet = jest.spyOn(WalletRepository.prototype, "update");

    beforeEach(() => {
      req = {
        body: {
          amount: 7250,
          data: mockDBUser,
        },
      } as Request;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should successfully fund the wallet", async () => {
      mockUpdateWallet.mockResolvedValueOnce(1);

      await WalletController.fund(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet.id, {
        ...mockDBWallet,
        balance: mockDBWallet.balance + req.body.amount,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Wallet funded successfully",
        data: {
          balance: mockDBWallet.balance + req.body.amount,
        },
      });
    });

    test("should throw an error if funding is unsuccessful", async () => {
      mockUpdateWallet.mockResolvedValueOnce(0);

      await WalletController.fund(req, res, next);

      expect(mockUpdateWallet).toHaveBeenCalledWith(mockDBWallet.id, {
        ...mockDBWallet,
        balance: mockDBWallet.balance + req.body.amount,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVER_ERROR);
      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR)
      );
    });
  });
});
