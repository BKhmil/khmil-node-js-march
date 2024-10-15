import { EActionTokenType } from "../enums/action-token-type.enum";

export interface IActionToken {
  _id?: string;
  token: string;
  type: EActionTokenType;
  _userId: string;
}
