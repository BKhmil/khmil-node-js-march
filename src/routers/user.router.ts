import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

// region ROUTES
router.get("/", userController.getList);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getById,
);

router.post(
  "/",
  commonMiddleware.isBodyValid(UserValidator.create),
  userController.create,
);

router.put(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.deleteById,
);
// endregion ROUTES

export const userRouter = router;
