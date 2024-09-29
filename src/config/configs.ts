import dotenv from "dotenv";

// Завантажує контент з файлу .env в process.env по дефолту.
dotenv.config();

// асоціації для даних з .env
export const configs = {
  APP_PORT: process.env.APP_PORT || 5001,
  APP_HOST: process.env.APP_HOST,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
};
