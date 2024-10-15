import { Roles } from "../enums/roles.enum";

export interface IUser {
  _id?: string;
  name: string;
  age: number;
  email: string;
  password: string;
  role: Roles;
  isVerified: boolean;
  isDeleted: boolean;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// тип який в результаті міститиме поля з паролем і емейлом
export type ISignIn = Pick<IUser, "email" | "password">;

export type IResetPasswordSend = Pick<IUser, "email">;
export type IResetPasswordSet = Pick<IUser, "password"> & { token: string };
