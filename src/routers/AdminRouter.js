import express from "express";
import {
  emailVerificationValidation,
  newAdminValidation,
} from "../middlewares/joiMiddleware.js";
const router = express.Router();
import { createNewAdmin, updateAdmin } from "../models/admin/AdminModel.js";
import { hashPassword } from "../util/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import {
  newAccountEmailVerificationEmail,
  emailVerifiedNotification,
} from "../util/nodemailer.js";
// import {dotenv} from ".env"

//admin user login
router.post("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "todo login",
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
    // chek if the combination of email and code exist in db if so set the status active and code to "" in the db, also update is email verified to true

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

export default router;
