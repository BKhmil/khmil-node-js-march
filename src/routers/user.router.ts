import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getAll);
router.post("/", userController.create);
router.put("/:userId", userController.replaceById);
router.delete("/:userId", userController.deleteById);

export const userRouter = router;
