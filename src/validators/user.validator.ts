import { body } from "express-validator";

const userValidationRules = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Email must be a valid email address [something]@gmail.com"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export { userValidationRules };
