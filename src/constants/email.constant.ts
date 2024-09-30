import { EEmailType } from "../enums/email-type.enum";

export const emailConstants = {
  [EEmailType.WELCOME]: {
    subject: "Welcome to our platform",
    template: "welcome",
  },
  [EEmailType.FORGOT_PASSWORD]: {
    subject: "Forgot password",
    template: "forgot-password",
  },
  [EEmailType.OLD_VISIT]: {
    subject: "Old visit",
    template: "old-visit",
  },
};
