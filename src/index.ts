import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./config/configs";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

const date = new Date();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    req.method +
      " " +
      req.path +
      " " +
      date.getHours() +
      "-" +
      date.getMinutes() +
      "-" +
      date.getSeconds(),
  );
  next();
});

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

app.listen(configs.APP_PORT, () => {
  mongoose.connect(configs.MONGO_URI);
  console.log(
    "Server is running on http://" + configs.APP_HOST + ":" + configs.APP_PORT,
  );
});
