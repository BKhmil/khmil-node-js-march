import { ApiError } from "../errors/api-error";
import { IResolved } from "../interfaces/resolved.interface";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public getAll(): Promise<IResolved> {
    return userRepository.getAll().then(
      (users): IResolved => ({
        status: 200,
        message: `Success!${users.length ? "" : " But no data yet"}`,
        users,
      }),
    );
  }

  public create(dto: Omit<IUser, "id">): Promise<IResolved> {
    return userRepository
      .getAll()
      .then((users) => {
        if (users.length) {
          users.push({ ...dto, id: users[users.length - 1].id + 1 });
        } else {
          users.push({ ...dto, id: 1 });
        }

        return userRepository.writeAll(users);
      })
      .then(
        (users): IResolved => ({
          status: 201,
          message: "User was successfully created or updated!",
          users,
        }),
      );
  }

  public replaceById(userId: number, dto: IUser): Promise<IResolved> {
    return userRepository
      .getById(userId)
      .then(({ users, userIndex }) => {
        if (users.length) {
          if (userIndex === -1) {
            throw new ApiError(
              "User not found, no users with id " + userId,
              404,
            );
          } else {
            users[userIndex] = { ...dto, id: userId };
          }
        } else {
          throw new ApiError("Can not access to user, db is empty", 404);
        }

        return userRepository.writeAll(users);
      })
      .then(
        (users): IResolved => ({
          status: 201,
          message: "User was successfully created or updated!",
          users,
        }),
      );
  }

  public deleteById(userId: number): Promise<IResolved> {
    return userRepository
      .getById(userId)
      .then(({ users, userIndex }) => {
        if (users.length) {
          if (userIndex === -1) {
            throw new ApiError(
              "User not found, no users with id " + userId,
              404,
            );
          } else {
            users.splice(userIndex, 1);
          }
        } else {
          throw new ApiError("Can not access to user, db is empty", 404);
        }
        return userRepository.writeAll(users);
      })
      .then(
        (users): IResolved => ({
          // 200, а не 204 для того щоб повідомлення виводило
          status: 200,
          message: "User was successfully deleted!",
          users,
        }),
      );
  }
}

export const userService = new UserService();
