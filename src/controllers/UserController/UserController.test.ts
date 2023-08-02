import {Request, Response, NextFunction} from "express";
import {hashSync, compareSync} from "bcrypt";
import {randomBytes} from "crypto";
import UserController from "./UserController";
import db from "../../config/db";
import {knex} from "../../__mocks__/db.mock";
import UserRepository from "../../repositories/UserRepository";
import {mockDBUser, mockUserRequestData} from "../../__mocks__/user.mock";
import {ErrorMessage, HttpStatus} from "../../utils/enums";
import AppError from "../../utils/AppError";

process.env.NODE_ENV = "test";

jest.mock("bcrypt");
jest.mock("crypto");
jest.mock("../../config/db.ts");

const mockedDBConfig = jest.mocked(db);
const mockedHashSync = jest.mocked(hashSync);
const mockedCompareSync = jest.mocked(compareSync);
const mockedRandomBytes = jest.mocked(randomBytes);

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

  // User signup tests
  describe("User signup", () => {
    const mockCreateUser = jest.spyOn(UserRepository.prototype, "create");

    beforeEach(() => {
      req = {
        body: mockUserRequestData,
      } as Request;

      mockedHashSync.mockReturnValueOnce("hashedPassword123");
    });

    test("should create a new user successfully", async () => {
      mockCreateUser.mockResolvedValueOnce(true);

      await UserController.signup(req, res, next);

      expect(mockedHashSync).toHaveBeenCalledWith(
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

  // User login tests
  describe("User login", () => {
    const mockUpdateUser = jest.spyOn(UserRepository.prototype, "update");

    beforeAll(() => {
      mockedRandomBytes.mockReturnValueOnce({
        toString: jest.fn().mockReturnValue(accessToken),
      } as any);
    });

    beforeEach(() => {
      req = {
        body: {
          email: mockUserRequestData.email,
          password: mockUserRequestData.password,
          data: mockDBUser,
        },
      } as Request;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should successfully login a user", async () => {
      mockUpdateUser.mockResolvedValueOnce(1);
      mockedCompareSync.mockReturnValueOnce(true);

      await UserController.login(req, res, next);

      expect(mockedCompareSync).toHaveBeenCalledWith(
        "password123",
        mockDBUser.password
      );
      expect(mockUpdateUser).toHaveBeenCalledWith(mockDBUser.id, {
        ...mockDBUser,
        accessToken,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login Successful",
        data: {
          name: mockDBUser.name,
          email: mockDBUser.email,
        },
        accessToken: accessToken,
      });
    });

    test("should throw an error if user password is incorrect", async () => {
      mockedCompareSync.mockReturnValueOnce(false);

      await UserController.login(req, res, next);

      expect(mockedCompareSync).toHaveBeenCalledWith(
        "password123",
        mockDBUser.password
      );

      expect(next).toHaveBeenCalledWith(
        new AppError(ErrorMessage.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
      );
    });
  });
});
