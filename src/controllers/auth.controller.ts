import { NextFunction, Request, Response } from "express";

import { ITokenPair } from "../interfaces/token.interface";
import { ISignIn, IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  // метод контроллеру який реєструє користувача в ситемі
  public async signUp(
    // щоб потім не писати: const dto = req.body as IUser
    // можна дженеріком типізувати дані в тілі запиту
    req: Request<object, object, IUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // просто викликаємо сервіс в який передаються дані які були в тілі запиту
      const result = await authService.signUp(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  // метод який аутентифікує користувача в системі
  public async signIn(
    req: Request<object, object, ISignIn>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // по аналогії з методолм вище, просто викликаємо відповідний сервіс передаючи відповідні дані
      const result = await authService.signIn(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request<object, object, Omit<ITokenPair, "accessToken">>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.refresh(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
