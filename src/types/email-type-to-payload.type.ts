import { EEmailType } from "../enums/email-type.enum";
import { EmailPayloadCombined } from "./email-payload-combined";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayload = {
  [EEmailType.WELCOME]: PickRequired<EmailPayloadCombined, "name">;

  [EEmailType.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombined,
    "name" | "email"
  >;

  [EEmailType.OLD_VISIT]: PickRequired<EmailPayloadCombined, "email">;
};