import { validationResult } from "express-validator";
import passport from "passport";
import validateSignUp from "../middlewares/validateSignUp.js";
import authDb from "../db/queries/authQueries.js";

function signUpGet(req, res, next) {
  try {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("forms/signUp");
  } catch (err) {
    next(err);
  }
}

async function signUp(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await authDb.signUp(username, password);

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/home");
    });
  } catch (err) {
    next(err);
  }
}

async function ifErrorsSignUp(req, res, next) {
  try {
    const errors = validationResult(req);
    const doesExists = await authDb.checkIfUserExists(req.body.username);

    if (!errors.isEmpty() || doesExists) {
      if (doesExists) {
        const mapped = errors.mapped();
        const formatedErrors = {
          ...mapped,
          username: {
            msg: "User already exists",
            value: mapped.username?.value || "",
          },
        };
        return res.render("forms/signUp", {
          data: req.body,
          errors: formatedErrors,
        });
      }

      res.render("forms/signUp", { data: req.body, errors: errors.mapped() });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

const signUpPost = [validateSignUp, ifErrorsSignUp, signUp];

function logInGet(req, res, next) {
  try {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("forms/logIn");
  } catch (err) {
    next(err);
  }
}

function logInPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      return res.render("forms/logIn", {
        data: req.body,
        errors: info,
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect("/home");
    });
  })(req, res, next);
}

function logOutGet(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid");
      res.redirect("/home");
    });
  });
}

const authController = {
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet,
};

export default authController;
