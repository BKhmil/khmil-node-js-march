import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  // метод який перевіряє валідність айдішки
  // приймає сам айді, повертає функцію яка ловить запит та вже безпосередньо перевіряє айді
  public isValidId(key: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // йде перевірка на тип із монгусу
        if (!isObjectIdOrHexString(req.params[key])) {
          throw new ApiError("Invalid ID ", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  // метод що перевіряє валідність даних які передаються в тілі запиту
  // приймає схему валідації і повертає функцію яка вже все рорбить
  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // виконується асинхронна валідація body і якщо все успішно то дані ніби повертаються назад через присвоєння
        // для того щоб були доступні далі, якщо там викидається помилка то нічого не присвоюється відповідно
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
