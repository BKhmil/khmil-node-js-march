import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  // метод контролеру який всі документи з колекції юзерів дістає
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

  // цей дістає один документ вже по айді
  public async getById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
      const result = await userService.getById(userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  // цей бере той самий jwtPayload з locals, який записується з мідлвари checkAccessToken
  // і потім за ним шукає конретний документ юзера
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const result = await userService.getMe(jwtPayload);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  // аналогічно тому що вище, але оновлюємо поля
  public async updateMe(
    req: Request<{ userId: string }, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const result = await userService.updateMe(jwtPayload, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // аналогічно тому що вище, але видаляємо документ
  public async deleteMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await userService.deleteMe(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
