import express from "express";
import { newAdminValidation } from "../middlewares/joiMiddleware.js";
const router = express.Router();
import { createNewAdmin } from "../models/admin/AdminModel.js";
import { hashPassword } from "../util/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { newAccountEmailVerificationEmail } from "../util/nodemailer.js";

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
      const uniqueLink = `http://localhost:3000/verify?c=${result.emailVerificationCode} & email=${result.email}`;
      newAccountEmailVerificationEmail(uniqueLink, result);

      res.json({
        status: "success",
        message: "New user has been registred!!!",
      });

      return;
    }

    res.json({
      status: "error",
      message: "Error, unable to creat a new user",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "There is already user exists";
    }
    error.erroCode = 200;
  }
});

export default router;
