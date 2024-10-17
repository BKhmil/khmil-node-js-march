import { EActionTokenType } from "../enums/action-token-type.enum";
import { EEmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
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

    const token = tokenService.generateActionTokens(
      { userId: user._id, role: user.role },
      EActionTokenType.VERIFY_EMAIL,
    );

    await actionTokenRepository.create({
      token,
      type: EActionTokenType.VERIFY_EMAIL,
      _userId: user._id,
    });

    try {
      await emailService.sendMail(user.email, EEmailType.WELCOME, {
        name: user.name,
        actionToken: token,
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
    await tokenRepository.deleteOneByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: payload.userId });

    return tokens;
  }

  public async logout(payload: ITokenPayload, tokenId: string): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    await tokenRepository.deleteOneByParams({ _id: tokenId });

    await emailService.sendMail(user.email, EEmailType.LOGOUT, {
      name: user.name,
    });
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    await tokenRepository.deleteManyByParams({ _userId: payload.userId });

    await emailService.sendMail(user.email, EEmailType.LOGOUT_ALL, {
      name: user.name,
    });
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const token = tokenService.generateActionTokens(
      { userId: user._id, role: user.role },
      EActionTokenType.FORGOT_PASSWORD,
    );

    await actionTokenRepository.create({
      token,
      type: EActionTokenType.FORGOT_PASSWORD,
      _userId: user._id,
    });

    await emailService.sendMail(user.email, EEmailType.FORGOT_PASSWORD, {
      name: user.name,
      email: user.email,
      actionToken: token,
    });
  }

  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    payload: ITokenPayload,
  ): Promise<void> {
    const { password: oldHashedPassword } = await userRepository.getById(
      payload.userId,
    );

    await this.isNewPasswordNewOrThrow(
      dto.password,
      oldHashedPassword,
      payload.userId,
    );

    await oldPasswordRepository.create({
      password: oldHashedPassword,
      _userId: payload.userId,
    });

    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(payload.userId, { password });

    await actionTokenRepository.deleteManyByParams({
      _userId: payload.userId,
      type: EActionTokenType.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByParams({ _userId: payload.userId });
  }

  public async verify(payload: ITokenPayload): Promise<void> {
    await userRepository.updateById(payload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: payload.userId,
      type: EActionTokenType.VERIFY_EMAIL,
    });
  }

  public async changePassword(
    payload: ITokenPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const { password: oldHashedPassword } = await userRepository.getById(
      payload.userId,
    );

    const isOldPasswordCorrect = await passwordService.comparePassword(
      dto.oldPassword,
      oldHashedPassword,
    );
    if (!isOldPasswordCorrect) {
      throw new ApiError("Invalid previous password", 401);
    }

    await this.isNewPasswordNewOrThrow(
      dto.password,
      oldHashedPassword,
      payload.userId,
    );

    await oldPasswordRepository.create({
      password: oldHashedPassword,
      _userId: payload.userId,
    });

    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(payload.userId, { password });
    await tokenRepository.deleteManyByParams({ _userId: payload.userId });
  }

  private async isNewPasswordNewOrThrow(
    newPassword: string,
    oldHashedPassword: string,
    userId: string,
  ): Promise<void> {
    const isNewPasswordSameAsACurrent = await passwordService.comparePassword(
      newPassword,
      oldHashedPassword,
    );
    if (isNewPasswordSameAsACurrent) {
      throw new ApiError("You can not set the old password", 401);
    }

    const docs = await oldPasswordRepository.getMany(userId);
    for (const doc of docs) {
      const isSame = await passwordService.comparePassword(
        newPassword,
        doc.password,
      );
      if (isSame) {
        throw new ApiError("You can not set the old password", 401);
      }
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
