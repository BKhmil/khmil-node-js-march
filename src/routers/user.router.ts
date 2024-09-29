import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

// оброблює ендпоінти пов'язані з отриманням/маніпуляцією інформації
const router = Router();

// region ROUTES
router.get("/", userController.getList);

// ендпоінти /me захищені і вимагають авторизації через Bearer стратегію
// відповідно кожен має мідлвару authMiddleware.checkAccessToken
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getById,
);
// endregion ROUTES

export const userRouter = router;
