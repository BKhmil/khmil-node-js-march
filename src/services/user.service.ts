import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  // метод який дістає всі документи з колекції users
  // ну, він сам не дістає, а лише викликає репозмторій який це робить
  // але оскільки більше інших дій не виконує, то можна і так сказати
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  // метод що отримує документ з колекції users по айдішці і паеревіряє чи такий існує
  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  // метод що отримує документ з колекції users по айді яке отримує з jwtPayload, який в собі містить айді і роль юзера
  // також виконує перевірку на наявність
  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  // метод що робить апдейт полів документу за айді і апдейдить поля які передає
  public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<IUser> {
    return await userRepository.updateById(jwtPayload.userId, dto);
  }

  // методж що видаляє документ з колекції users по айді яке отримує з jwtPayload
  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    return await userRepository.deleteMe(jwtPayload.userId);
  }
}

export const userService = new UserService();
