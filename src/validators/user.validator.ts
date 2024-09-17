import { body } from "express-validator";

import { Roles } from "../enums/roles.enum";

const userValidationRules = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("age")
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be a valid number between 18 and 120"),
  body("email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Email must be a valid email address [something]@gmail.com"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(Object.values(Roles))
    .withMessage("Role must be a valid role"),
  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),
  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("isDeleted must be a boolean"),
];

export { userValidationRules };
