// import { ApiError } from "../errors/api-error";
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

    users.push({ ...dto });

    const updatedUsers = await userRepository.writeAll(users);

    return {
      status: 201,
      message: "User was successfully created or updated!",
      users: updatedUsers,
    };
  }

  public async getSingleById(userId: string): Promise<IResolved> {
    const user = await userRepository.getSingleById(userId);
    return {
      status: 200,
      message: "Success",
      users: [user],
    };
  }

  public async replaceById(userId: string, dto: IUser): Promise<IResolved> {
    const user = await userRepository.updateById(userId, dto);

    return {
      status: 201,
      message: "User was successfully created or updated!",
      users: [user],
    };
  }

  public async deleteById(userId: string): Promise<IResolved> {
    const user = await userRepository.deleteById(userId);

    return {
      // 200, а не 204 для того щоб повідомлення виводило
      status: 200,
      message: "User was successfully deleted!",
      users: [user],
    };
  }
}

export const userService = new UserService();
