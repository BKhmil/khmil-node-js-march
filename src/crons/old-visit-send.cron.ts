import { CronJob } from "cron";

import { EEmailType } from "../enums/email-type.enum";
import { timeHelper } from "../helpers/time.helper";
import { IUsersToNotify } from "../interfaces/users-to-notify.interface";
import { tokenRepository } from "../repositories/token.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    const lastLine = timeHelper.subtractByParams(30, "minutes");

    const usersToNotify: IUsersToNotify[] = await tokenRepository.aggregate([
      {
        $group: {
          _id: "$_userId",
          latestToken: {
            $max: "$createdAt",
          },
        },
      },
      {
        $match: {
          latestToken: { $lt: lastLine },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
    ]);

    for (const user of usersToNotify) {
      console.log(user);
      await emailService.sendMail(user.userInfo.email, EEmailType.OLD_VISIT, {
        name: user.userInfo.name,
      });
    }

    console.log(lastLine);
  } catch (e) {
    console.error(e);
  }
};

export const oldVisitSendCronJob = new CronJob("0,20,40 * * * * *", handler);
