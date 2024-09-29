import * as jsonwebtoken from "jsonwebtoken";

import { configs } from "../config/configs";
import { TokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class TokenService {
  // метод що генерує токени
  public generateTokens(payload: ITokenPayload): ITokenPair {
    // аксес, на основі відповідних даних
    const accessToken = jsonwebtoken.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRATION,
    });

    // і так само рефреш
    const refreshToken = jsonwebtoken.sign(
      payload,
      configs.JWT_REFRESH_SECRET,
      { expiresIn: configs.JWT_REFRESH_EXPIRATION },
    );

    return { accessToken, refreshToken };
  }

  // метод що перевіряє токен в залежності від типу
  public verifyToken(token: string, tokenType: TokenType): ITokenPayload {
    // змінна в яку буде записано secret відповідного токену
    let secret: string;
    try {
      // перевірка йде через світч і призначення відповідних значень
      switch (tokenType) {
        case TokenType.ACCESS:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case TokenType.REFRESH:
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      // повертаємо результат методу verify, який перевіряє по сікрету і декодить по ньому ж
      // щоб повернути payload з токену
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch {
      throw new ApiError("Invalid token", 401);
    }
  }
}

export const tokenService = new TokenService();
