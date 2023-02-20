import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import {
  emailVerificationValidation,
  newAdminValidation,
  loginValidation,
  resetPassswordValidation,
} from "../middlewares/joiMiddleware.js";
import {
  createNewAdmin,
  updateAdmin,
  findUser,
} from "../models/admin/AdminModel.js";
import { sessionToken } from "../models/reset-password/SessionTokenModel.js";
import { hashPassword, comparePassword } from "../util/bcrypt.js";
import {
  newAccountEmailVerificationEmail,
  emailVerifiedNotification,
  resetPasswordNotification,
} from "../util/nodemailer.js";

//admin user login
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find user by email

    const user = await findUser({ email });
    if (user?._id) {
      //check if plain password and hashed password are mathced or not
      const isPasswordMtach = await comparePassword(password, user.password);

      // console.log(isPasswordMtach, "=====");

      //login successful or invalid login details

      if (isPasswordMtach) {
        //here, user will not see password and version after login  by making them undefined
        user.password = undefined;
        user.__v = undefined;
        res.json({
          status: "success",
          message: "Login success!!!",
          user,
        });
        return;
        //here return will stop the process once login succefull.
      }
    }
    res.json({
      status: "error",
      message: "Invalid Login Details",
    });
  } catch (error) {
    next(error);
  }
});

//admin user registration
router.post("/register", newAdminValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    req.body.emailVerificationCode = uuidv4();

    const result = await createNewAdmin(req.body);

    // console.log(result);

    if (result?._id) {
      const uniqueLink = `${process.env.FRONTEND_ROOT_URL}/verify?c=${result.emailVerificationCode}&email=${result.email}`;
      newAccountEmailVerificationEmail(uniqueLink, result);

      res.json({
        status: "success",
        message:
          "New user has been registred!!! We have sent a verification email. Please check yopur email including junk folder and follow the steps given in the link.",
      });

      return;
    }

    res.json({
      status: "error",
      message: "Error, unable to creat a new user",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "There is already user exists with this email";
      error.erroCode = 200;
    }
    next(error);
  }
});

//admin user email verification
router.post("/verify", emailVerificationValidation, async (req, res, next) => {
  try {
    // chek if the combination of email and code exist in db, if so set the status active and code to "" in the db, also update is email verified to true

    const obj = {
      status: "active",
      isEmailVerified: true,
      emailVerificationCode: "",
    };

    const user = await updateAdmin(req.body, obj);

    if (user?._id) {
      //send email notification
      emailVerifiedNotification(user);

      res.json({
        status: "success",
        message: "Your account has been verified. You may login now.",
      });
      return;
    }

    res.json({
      status: "error",
      message: "The link is invalid or expired.",
    });
  } catch (error) {
    next(error);
  }
});

//request link for reset password
router.post(
  "/reset-password",
  resetPassswordValidation,
  async (req, res, next) => {
    try {
      const userEmail = await findUser(req.body);
      console.log(userEmail);

      //create a token
      const generateOneTimePassword = (n) =>
        String(Math.ceil(Math.random() * 10 ** n)).padStart(6, "0");
      // n being the lengneth of the random number.
      console.log(generateOneTimePassword);

      const result = sessionToken(association, token);

      if (userEmail?._id) {
        resetPasswordNotification(userEmail);

        res.json({
          status: "success",
          message: "Your password will be reset ",
        });
        return;
      }
      res.json({
        status: "error",
        message: "The link is invalid or expired.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
