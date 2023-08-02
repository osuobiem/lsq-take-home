import {Request, Response, NextFunction} from "express";
import {hashSync} from "bcrypt";
import UserController from "./UserController";
import db from "../config/db";
import {knex} from "../__mocks__/db.mock";
import UserRepository from "../repositories/UserRepository";
import {mockUserRequestData} from "../__mocks__/user.mock";
import {ErrorMessage, HttpStatus} from "../utils/enums";
import AppError from "../utils/AppError";

process.env.NODE_ENV = "test";

jest.mock("bcrypt");
jest.mock("../config/db.ts");

const mockDBConfig = jest.mocked(db);
const mockHashSync = jest.mocked(hashSync);

describe("UserController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    mockDBConfig.mockReturnValue(knex as any);
  });

  // User signup tests
  describe("User signup", () => {
    const mockCreateUser = jest.spyOn(UserRepository.prototype, "create");

    beforeEach(() => {
      req = {
        body: mockUserRequestData,
      } as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      next = jest.fn();

      mockHashSync.mockImplementation(() => "hashedPassword123");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create a new user successfully", async () => {
      mockCreateUser.mockResolvedValueOnce(true);

      await UserController.signup(req, res, next);

      expect(mockHashSync).toHaveBeenCalledWith(
        "password123",
        expect.any(Number)
      );
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith("User created successfully");
    });

    test("should throw an error if user creation fails", async () => {
      mockCreateUser.mockResolvedValue(false);

      await UserController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.SERVER_ERROR, HttpStatus.SERVER_ERROR)
      );
    });
  });
});
