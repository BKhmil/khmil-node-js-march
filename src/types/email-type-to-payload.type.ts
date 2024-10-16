import { EEmailType } from "../enums/email-type.enum";
import { EmailPayloadCombined } from "./email-payload-combined";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayload = {
  [EEmailType.WELCOME]: PickRequired<
    EmailPayloadCombined,
    "name" | "actionToken"
  >;

  [EEmailType.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombined,
    "name" | "email" | "actionToken"
  >;

  [EEmailType.OLD_VISIT]: PickRequired<EmailPayloadCombined, "email">;

  [EEmailType.LOGOUT]: PickRequired<EmailPayloadCombined, "name">;

  [EEmailType.LOGOUT_ALL]: PickRequired<EmailPayloadCombined, "name">;
};
