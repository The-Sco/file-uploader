import { body } from "express-validator";

const validateNewFolder = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("TItle cannot be blank")
    .isLength({ max: 56 })
    .withMessage("Title cannot exceed 56 characters"),
];

export default validateNewFolder;
