import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getList();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async create(
    // ESLint не дозволяє {}, {}
    req: Request<object, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getById(req.params.userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.updateById(req.params.userId, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteById(req.params.userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
