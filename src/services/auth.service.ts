import { EEmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { ISignIn, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  // метод сервісу який реєструє користувача в системі
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    // перевірка на існуючий емейл
    await this.isEmailExistOrThrow(dto.email);

    // якщо зверху все пройшло чітко і не було викинуто помилку, то викликаємо сервіс паролів і хешуємо пароль
    const hashedPassword = await passwordService.hashPassword(dto.password);

    // якщо зверху все пройшло ок, додаємо новий документ до колекції, в поле паролю передаємо вже захешований пароль
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    // якщо зверху все пройшло ок то значить що користувач в базі вже є, час видати йому токени
    // як payload віддаємо айді та роль користувача
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });

    // після генерації записуємо токени у бд
    await tokenRepository.create({ ...tokens, _userId: user._id });

    try {
      await emailService.sendMail(user.email, EEmailType.WELCOME, {
        name: user.name,
      });
    } catch (e) {
      throw new ApiError(e.message, 500);
    }

    // віддаємо назад дані з токенами
    return { user, tokens };
  }

  // метод який аутентифікує користувача в системі
  public async signIn(
    dto: ISignIn,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    // спочатку дивимося чи існує юзер в системі, перевіряючи це через емейл
    const user = await userRepository.getByEmail(dto.email);
    // якщо ні то помилка відповідна
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // якщо юзер існує перевіряємо чи правильний пароль
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    // якщо ні - помилка
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    // якщо все гуд, то генеруємо токени
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    // і записуємо їх в бд
    await tokenRepository.create({ ...tokens, _userId: user._id });
    // віддаємо назад інфу про юзера і токени
    // як я розумію то в подальшому перепишемо так щоб просто токени віддавались
    return { user, tokens };
  }

  public async refresh(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: payload.userId });

    return tokens;
  }

  public async logout(
    accessToken: string,
    payload: ITokenPayload,
  ): Promise<void> {
    await tokenRepository.deleteSignByAccessToken(accessToken);

    const user = await userRepository.getById(payload.userId);
    // по-ідеї це не потрібно, бо якщо користувач скористався функцією логауту то явно він є в нашій системі
    // if (!user) {
    //   throw new ApiError("User not found", 404);
    // }

    try {
      await emailService.sendMail(user.email, EEmailType.LOGOUT, {
        name: user.name,
      });
    } catch (e) {
      throw new ApiError(e.message, 500);
    }
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    await tokenRepository.deleteAllSignsByUserId(payload.userId);

    const user = await userRepository.getById(payload.userId);

    try {
      await emailService.sendMail(user.email, EEmailType.LOGOUT_ALL, {
        name: user.name,
      });
    } catch (e) {
      throw new ApiError(e.message, 500);
    }
  }

  // метод для перевірки існування емейлу
  private async isEmailExistOrThrow(email: string): Promise<void> {
    // отримуємо користувача за емейлом
    const user = await userRepository.getByEmail(email);
    // якщо такий і справді є, кидаємо помилку, адже емейл має бути унікальним для кожного користувача
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}

export const authService = new AuthService();
