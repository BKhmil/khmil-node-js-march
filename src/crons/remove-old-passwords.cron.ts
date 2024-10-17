import { CronJob } from "cron";

import { configs } from "../config/configs";
import { timeHelper } from "../helpers/time.helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfigString(
      configs.OLD_PASSWORD_EXPIRATION,
    );
    const date = timeHelper.subtractByParams(value, unit);
    const deletedCount = await oldPasswordRepository.deleteBeforeDate(date);
    console.log("Deleted " + deletedCount + " old passwords");
  } catch (e) {
    console.error(e);
  }
};
//                                                   хв гд    тобто кожен день о 0 хвилині 3 години ночі - наче так
export const removeOldPasswordsCronJob = new CronJob("0 3 * * *", handler);
