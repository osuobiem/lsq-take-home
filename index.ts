import express, {Express} from "express";
import dotenv from "dotenv";
import errorMiddleware from "./src/middleware/error.middleware";
import bodyParser from "body-parser";
import router from "./src/router";
import {errors} from "celebrate";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

app.use(router);

// Validation errors middleware
app.use(errors());

// User error middleware
app.use(errorMiddleware);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
