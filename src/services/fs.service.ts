import fs from "node:fs";

import { PATH_TO_DB } from "../constants";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";

class FsService {
  public readAllFromDB(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(PATH_TO_DB, "utf-8", (err, data) => {
        if (err) {
          reject(new ApiError("Server error! Can not read data from db", 500));
        } else {
          const validData: IUser[] = data ? JSON.parse(data) : [];
          resolve(validData);
        }
      });
    });
  }

  public writeAllToDB(users: IUser[]): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      fs.writeFile(PATH_TO_DB, JSON.stringify(users), {}, (err) => {
        if (err) {
          reject(new ApiError("Server error! Can not write data to db", 500));
        } else {
          resolve(users);
        }
      });
    });
  }
}

export const fsService = new FsService();
