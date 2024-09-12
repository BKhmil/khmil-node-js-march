import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { IUser } from "../interfaces/user.interface";

class UserMiddleware {
  public validate(
    req: Request<object, object, IUser>,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

export const userMiddleware = new UserMiddleware();
