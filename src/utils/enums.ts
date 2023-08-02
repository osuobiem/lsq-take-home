export enum TransactionType {
  FUND = "fund",
  TRANSFER = "transfer",
  WITHDRAW = "withdraw",
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export enum ErrorMessage {
  SERVER_ERROR = "Something went wrong!",
  INVALID_CREDENTIALS = "Invalid credentials",
  TOKEN_IS_REQUIRED = "Access token is required",
  INVALID_TOKEN = "Invalid access token",
  INSUFFICIENT_FUNDS = "Insufficient funds",
  INVALID_TRANSFER = "Invalid transfer request",
  USER_DOES_NOT_EXIST = "User does not exist",
}
