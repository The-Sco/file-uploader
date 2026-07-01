import { body } from "express-validator";

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can not be blank")
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be between 3 and 24 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password can not be blank")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation can not be blank")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

export default validateSignUp;
