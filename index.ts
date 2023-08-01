import express, {Express} from "express";

const app: Express = express();

app.get("/", (req, res) => res.send("Welcome"));

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
