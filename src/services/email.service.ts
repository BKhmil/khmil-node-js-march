import path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { configs } from "../config/configs";
import { emailConstants } from "../constants/email.constant";
import { EEmailType } from "../enums/email-type.enum";
import { EmailTypeToPayload } from "../types/email-type-to-payload.type";

class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mxslurp.click",
      port: 2525,
      secure: false,
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"),
        partialsDir: path.join(process.cwd(), "src", "templates", "partials"),
      },
      viewPath: path.join(process.cwd(), "src", "templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }

  public async sendMail<T extends EEmailType>(
    to: string,
    type: T,
    context: EmailTypeToPayload[T],
  ): Promise<void> {
    const { subject, template } = emailConstants[type];

    context["frontUrl"] = configs.APP_FRONT_URL;
    const options = {
      from: configs.SMTP_EMAIL,
      to,
      subject,
      template,
      context,
    };
    await this.transporter.sendMail(options);
  }
}

export const emailService = new EmailService();
