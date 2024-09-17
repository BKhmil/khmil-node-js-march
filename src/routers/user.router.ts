import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { userValidationRules } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getSingleById,
);
router.post(
  "/",
  userValidationRules,
  userMiddleware.validate,
  userController.create,
);
router.put(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userValidationRules,
  userMiddleware.validate,
  userController.replaceById,
);
router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.deleteById,
);

export const userRouter = router;
