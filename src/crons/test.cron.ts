import { CronJob } from "cron";

const handler = async () => {
  console.log("Test cron is running");
};

export const testCronJob = new CronJob("0 * * * * *", handler);
