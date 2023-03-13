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
import {
  createNewSession,
  deleteSession,
} from "../models/session/SessionTokenModel.js";
import { hashPassword, comparePassword } from "../util/bcrypt.js";
import { signAccessJWT, signRefreshJWT } from "../util/jwt.js";
import {
  newAccountEmailVerificationEmail,
  emailVerifiedNotification,
  emailOtp,
  passwordUpdateNotification,
} from "../util/nodemailer.js";
import { numString } from "../util/randomGenerator.js";

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
        //create accessJWT, rerreshJWT
        //store accessJWT in session table
        //store refreshJWT in user table
        //retrurn tokens to the user/client
        user.password = undefined;
        user.__v = undefined;
        res.json({
          status: "success",
          message: "Login success!!!",
          user,
          tokens: {
            accessJWT: await signAccessJWT({ email }),
            refreshJWT: await signRefreshJWT({ email }),
          },
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

//OTP request
router.post("/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        status: "error",
        message: "Invalid request",
      });
    }

    const user = await findUser({ email });
    if (user?._id) {
      //create OTP (6 digit code)
      const token = numString(6);
      const obj = {
        token,
        associate: email,
      };

      //store otp and email in a new table calles sessions in database
      const result = await createNewSession(obj);

      if (result?._id) {
        //send that otp to their email
        emailOtp({ email, token });

        return res.json({
          status: "success",
          message:
            "We have sent you an OTP to your email, check your email and fill up the form below",
        });
      }
    }
    res.json({
      status: "error",
      message: "Wrong email",
    });
  } catch (error) {
    next(error);
  }
});

//request link for reset password
router.patch(
  "/reset-password",
  resetPassswordValidation,
  async (req, res, next) => {
    try {
      const { email, otp, password } = req.body;

      const deletedToken = await deleteSession({ email, otp });

      if (deletedToken?._id) {
        //encrypt password and upadte password
        const user = await updateAdmin(
          { email },
          { password: hashPassword(password) }
        );

        if (user?._id) {
          //send email notification
          passwordUpdateNotification(user);

          return res.json({
            status: "success",
            message: "Your password has been updated successfully",
          });
        }
      }

      res.json({
        status: "error",
        message:
          "We are unable to reset your password at this time. Invalid or expired token",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
