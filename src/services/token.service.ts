import * as jsonwebtoken from "jsonwebtoken";

import { configs } from "../config/configs";
import { EActionTokenType } from "../enums/action-token-type.enum";
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
  public verifyToken(
    token: string,
    tokenType: TokenType | EActionTokenType,
  ): ITokenPayload {
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
        case EActionTokenType.FORGOT_PASSWORD:
          secret = configs.ACTION_FORGOT_PASSWORD_SECRET;
          break;
        case EActionTokenType.VERIFY_EMAIL:
          secret = configs.ACTION_VERIFY_EMAIL_SECRET;
          break;
        default:
          throw new ApiError("Invalid token type", 400);
      }

      // повертаємо результат методу verify, який перевіряє по сікрету і декодить по ньому ж
      // щоб повернути payload з токену
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch {
      throw new ApiError("Invalid token", 401);
    }
  }

  public generateActionTokens(
    payload: ITokenPayload,
    tokenType: EActionTokenType,
  ): string {
    let secret: string;
    let expiration: string;
    switch (tokenType) {
      case EActionTokenType.FORGOT_PASSWORD:
        secret = configs.ACTION_FORGOT_PASSWORD_SECRET;
        expiration = configs.ACTION_FORGOT_PASSWORD_EXPIRATION;
        break;
      case EActionTokenType.VERIFY_EMAIL:
        secret = configs.ACTION_VERIFY_EMAIL_SECRET;
        expiration = configs.ACTION_VERIFY_EMAIL_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid token type", 400);
    }

    return jsonwebtoken.sign(payload, secret, {
      expiresIn: expiration,
    });
  }
}

export const tokenService = new TokenService();
