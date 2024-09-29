import { Roles } from "../enums/roles.enum";

// інтерфейс для того що ми кладемо в payload при створенні токенів
export interface ITokenPayload {
  userId: string;
  role: Roles;
}

// інтерфейс пари токенів
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

// for model
export interface IToken {
  _id?: string;
  _userId: string;
  accessToken: string;
  refreshToken: string;
}
