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
// до речі здивувався що в даному випадку оператор | працює не як union, а як об'єднання
export type ISignIn = Pick<IUser, "email" | "password">;
