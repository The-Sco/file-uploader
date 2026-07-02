import { body } from "express-validator";

const validateShareFolder = [
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration field cannot be blank")
    .custom((value) => {
      const n = parseInt(value);
      if (0 >= n || n >= 91) {
        throw new Error("Duration must be between 1 and 90");
      }
      return true;
    }),
];

export default validateShareFolder;
