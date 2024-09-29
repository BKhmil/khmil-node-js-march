import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  // метод що отримує всі документи з колекції users
  public async getList(): Promise<IUser[]> {
    return await User.find();
  }

  // метод що створює новий документ в колекції users
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  // метод що знаходить документ за айді в колекції users
  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  // метод що шукає документ за емейлом в колекції users при цьому додаючи в результаті поле з паролем
  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  // метод що оновлює документ в колекції users за його айді
  // { new: true } вказує на те що документ має повернутися після оновлення
  public async updateById(userId: string, dto: IUser): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  // метод що видаляє документ в колекції users за його айді
  public async deleteMe(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}

export const userRepository = new UserRepository();
