import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public getAll(): Promise<IUser[]> {
    return User.find();
  }

  public writeAll(dto: IUser[]): Promise<IUser[]> {
    return User.create(dto);
  }

  public getSingleById(id: string): Promise<IUser> {
    return User.findById(id);
  }

  public updateById(id: string, dto: IUser): Promise<IUser> {
    return User.findByIdAndUpdate(id, dto, { new: true });
  }

  public deleteById(id: string): Promise<IUser> {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
