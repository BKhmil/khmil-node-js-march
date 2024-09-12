import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import { userValidationRules } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.post(
  "/",
  userValidationRules,
  userMiddleware.validate,
  userController.create,
);
router.put(
  "/:userId",
  userValidationRules,
  userMiddleware.validate,
  userController.replaceById,
);
router.delete("/:userId", userController.deleteById);

export const userRouter = router;
