import { NextFunction, Request, Response } from "express";

import { TokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  // метод який первіряє аксес токен
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // отримуємо значення з поля authorization
      const header = req.headers.authorization;
      // якщо немає - помилка
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      // якщо є то це має бути значення типу: Bearer asfdhuf782y23nfd2fd23fd2fddfsfgehvxc
      // тому сплітимо по пробілу цей рядок і беремо другий елемент, який і буде нашим токеном
      const accessToken = header.split(" ")[1];
      // робимо перевірку токена, з лекції зрозумів що тут робиться перевірка на те чи не змінений був токен
      // + на те чи він дійсний
      const payload = tokenService.verifyToken(accessToken, TokenType.ACCESS);

      // отут шукаємо токен в бд, бо наприклад користувач міг розлогінитися, але у токена ще час життя 10+ днів
      // а у випадку розлогіну ми б видалили з бд токени
      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      // кладемо payload в locals, щоб він був доступний в наступних функціях які опрацьовуватимуть запит
      req.res.locals.jwtPayload = payload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  // метод який первіряє refresh токен
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // отримуємо значення з поля authorization
      const header = req.headers.authorization;
      // якщо немає - помилка
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      // якщо є то це має бути значення типу: Bearer asfdhuf782y23nfd2fd23fd2fddfsfgehvxc
      // тому сплітимо по пробілу цей рядок і беремо другий елемент, який і буде нашим токеном
      const refreshToken = header.split(" ")[1];
      // робимо перевірку токена, з лекції зрозумів що тут робиться перевірка на те чи не змінений був токен
      // + на те чи він дійсний
      const payload = tokenService.verifyToken(refreshToken, TokenType.REFRESH);

      // отут шукаємо токен в бд, бо наприклад користувач міг розлогінитися, але у токена ще час життя 10+ днів
      // а у випадку розлогіну ми б видалили з бд токени
      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      // кладемо payload в locals, щоб він був доступний в наступних функціях які опрацьовуватимуть запит
      // так само і з refreshToken
      req.res.locals.jwtPayload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
