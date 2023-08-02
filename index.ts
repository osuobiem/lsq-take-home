import express, {Express} from "express";
import dotenv from "dotenv";
import errorMiddleware from "./src/middleware/error.middleware";
import AppError from "./src/utils/AppError";
import {HttpStatus} from "./src/utils/enums";

dotenv.config();

const app: Express = express();

app.get("/", (req, res, next) => {
  try {
    throw new AppError("You cannot access this", HttpStatus.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
});

// User error middleware
app.use(errorMiddleware);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
