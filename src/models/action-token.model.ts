import { model, Schema } from "mongoose";

import { EActionTokenType } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";
import { User } from "./user.model";

const actionTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    type: { type: String, required: true, enum: EActionTokenType },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// цей запис означає що модель буде працювати з типом <IToken>, ця типізація саме для тайпскрипта
// і ця модель буде маніпулювати документами з колекції tokens, а tokenSchema визначає структуру цих документів
export const ActionToken = model<IActionToken>(
  "action-tokens",
  actionTokenSchema,
);
