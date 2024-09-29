import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

// цей роутер відпрацьовує на ендпоінті /auth
const router = Router();

// оброблює ендпоінти пов'язані з аутентифікацією та авторизацією
router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.signIn),
  authController.signIn,
);

router.post("/refresh", authController.refresh);

export const authRouter = router;