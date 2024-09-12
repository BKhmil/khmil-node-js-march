import express, { NextFunction, Request, Response } from "express";

// import { body, validationResult } from "express-validator";
import { PORT } from "./constants";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use(
  (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Press F" });
    }
  },
);

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err.message, err.stack);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
