import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { User } from "./user.model";

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// цей запис означає що модель буде працювати з типом <IToken>, ця типізація саме для тайпскрипта
// і ця модель буде маніпулювати документами з колекції tokens, а tokenSchema визначає структуру цих документів
export const Token = model<IToken>("tokens", tokenSchema);
