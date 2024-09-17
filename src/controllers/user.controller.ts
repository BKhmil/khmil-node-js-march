import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, message, users } = await userService.getAll();
      res.status(status).json({ message, users });
    } catch (e) {
      next(e as ApiError);
    }
  }

  public async create(
    // ESLint не дозволяє {}, {}
    req: Request<object, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, message, users } = await userService.create(req.body);
      res.status(status).json({ message, data: users });
    } catch (e) {
      next(e as ApiError);
    }
  }

  public async getSingleById(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, message, users } = await userService.getSingleById(
        req.params.userId,
      );
      res.status(status).json({ message, data: users });
    } catch (e) {
      next(e as ApiError);
    }
  }

  public async replaceById(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, message, users } = await userService.replaceById(
        req.params.userId,
        req.body,
      );
      res.status(status).json({ message, data: users });
    } catch (e) {
      next(e as ApiError);
    }
  }

  public async deleteById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, message, users } = await userService.deleteById(
        req.params.userId,
      );
      res.status(status).json({ message, data: users });
    } catch (e) {
      next(e as ApiError);
    }
  }
}

export const userController = new UserController();
