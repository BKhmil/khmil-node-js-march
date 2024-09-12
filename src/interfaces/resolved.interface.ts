import { IUser } from "./user.interface";

export interface IResolved {
  users: IUser[];
  message: string;
  status: number;
}
