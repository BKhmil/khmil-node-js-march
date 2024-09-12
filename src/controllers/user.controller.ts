import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return userService
      .getAll()
      .then(({ status, message, users }) => {
        res.status(status).json({ message, users });
      })
      .catch((err: ApiError) => {
        next(err);
      });
  }

  public create(
    // ESLint не дозволяє {}, {}
    req: Request<object, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return userService
      .create(req.body)
      .then(({ status, message, users }) => {
        res.status(status).json({ message, data: users });
      })
      .catch((err: ApiError) => {
        next(err);
      });
  }

  public replaceById(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return userService
      .replaceById(Number(req.params.userId), req.body)
      .then(({ status, message, users }) => {
        res.status(status).json({ message, data: users });
      })
      .catch((err: ApiError) => {
        next(err);
      });
  }

  public deleteById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return userService
      .deleteById(Number(req.params.userId))
      .then(({ status, message, users }) => {
        res.status(status).json({ message, data: users });
      })
      .catch((err: ApiError) => {
        next(err);
      });
  }
}

export const userController = new UserController();
