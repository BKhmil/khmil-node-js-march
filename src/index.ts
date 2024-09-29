import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./config/configs";
import { ApiError } from "./errors/api-error";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// мідлвара яка логує всі запити у форматі: method - path - requestBody
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method + " " + req.path + " " + JSON.stringify(req.body));
  next();
});

// після того як у верхній мідлварі відпрацював NextFunction, то запит перенаправляється "вниз" по коду
// і якщо шлях співпадає то роутери нижче відпрацьовують і опрацьовують запит
app.use("/auth", authRouter);
app.use("/users", userRouter);

// якщо в будь-якому місці програми що знаходиться вище була викинута помилка яку ще не спіймали через catch,
// то вона потрапляє сюди
app.use(
  (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    // якщо це помилка нашого кастомного типу, то статус і месседж беруться з неї
    if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  },
);

// тут і так все зрозуміло
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err.message, err.stack);
  process.exit(1);
});

// ставимо аппку на прослухування відповідного порту
// другий аргумент ец колбек який спрацьовує після того як порт починає прослуховуватися
// тут спочатку йде підключення до монгодб, а потім лог про успішний запуск серверу
app.listen(configs.APP_PORT, async () => {
  await mongoose.connect(configs.MONGO_URI);
  console.log(
    "Server is running on http://" + configs.APP_HOST + ":" + configs.APP_PORT,
  );
});
