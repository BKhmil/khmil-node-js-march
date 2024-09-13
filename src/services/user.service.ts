import { ApiError } from "../errors/api-error";
import { IResolved } from "../interfaces/resolved.interface";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAll(): Promise<IResolved> {
    const users = await userRepository.getAll();
    return {
      status: 200,
      message: `Success!${users.length ? "" : " But no data yet"}`,
      users,
    };
  }

  public async create(dto: Omit<IUser, "id">): Promise<IResolved> {
    const users = await userRepository.getAll();

    if (users.length) {
      users.push({ ...dto, id: users[users.length - 1].id + 1 });
    } else {
      users.push({ ...dto, id: 1 });
    }

    const updatedUsers = await userRepository.writeAll(users);

    return {
      status: 201,
      message: "User was successfully created or updated!",
      users: updatedUsers,
    };
  }

  public async replaceById(userId: number, dto: IUser): Promise<IResolved> {
    const { users, userIndex } = await userRepository.getById(userId);

    if (users.length) {
      if (userIndex === -1) {
        throw new ApiError("User not found, no users with id " + userId, 404);
      } else {
        users[userIndex] = { ...dto, id: userId };
      }
    } else {
      throw new ApiError("Can not access to user, db is empty", 404);
    }

    const updatedUsers = await userRepository.writeAll(users);

    return {
      status: 201,
      message: "User was successfully created or updated!",
      users: updatedUsers,
    };
  }

  public async deleteById(userId: number): Promise<IResolved> {
    const { users, userIndex } = await userRepository.getById(userId);

    if (users.length) {
      if (userIndex === -1) {
        throw new ApiError("User not found, no users with id " + userId, 404);
      } else {
        users.splice(userIndex, 1);
      }
    } else {
      throw new ApiError("Can not access to user, db is empty", 404);
    }
    const updatedUsers = await userRepository.writeAll(users);

    return {
      // 200, а не 204 для того щоб повідомлення виводило
      status: 200,
      message: "User was successfully deleted!",
      users: updatedUsers,
    };
  }
}

export const userService = new UserService();
