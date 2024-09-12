import { IUser } from "../interfaces/user.interface";
import { fsService } from "../services/fs.service";

class UserRepository {
  public getAll(): Promise<IUser[]> {
    return fsService.readAllFromDB();
  }

  public writeAll(dto: IUser[]): Promise<IUser[]> {
    return fsService.writeAllToDB(dto);
  }

  public getById(id: number): Promise<{ users: IUser[]; userIndex: number }> {
    return fsService.readAllFromDB().then((users) => {
      return {
        users,
        userIndex: users.findIndex((user) => user.id === id),
      };
    });
  }
}

export const userRepository = new UserRepository();
