import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { EActionTokenType } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
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

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post("/forgot-password", authController.forgotPasswordSendEmail);

router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(EActionTokenType.FORGOT_PASSWORD),
  commonMiddleware.isBodyValid(UserValidator.forgotPasswordSet),
  authController.forgotPasswordSet,
);

router.put(
  "/change-password",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authController.changePassword,
);

router.put(
  "/verify-email",
  authMiddleware.checkActionToken(EActionTokenType.VERIFY_EMAIL),
  authController.verify,
);

export const authRouter = router;
