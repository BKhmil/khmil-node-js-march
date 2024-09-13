import fs from "node:fs/promises";

import { PATH_TO_DB } from "../constants";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";

class FsService {
  public async readAllFromDB(): Promise<IUser[]> {
    try {
      const data = await fs.readFile(PATH_TO_DB, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.log(e);
      throw new ApiError("Server error! Can not read data from db", 500);
    }
  }

  public async writeAllToDB(users: IUser[]): Promise<IUser[]> {
    try {
      await fs.writeFile(PATH_TO_DB, JSON.stringify(users), {});
      return users;
    } catch (e) {
      console.log(e);
      throw new ApiError("Server error! Can not write data to db", 500);
    }
  }
}

export const fsService = new FsService();
