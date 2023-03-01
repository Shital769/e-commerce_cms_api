import express from "express";
import slugify from "slugify";
const router = express.Router();

import {
  createNewPayment,
  updatePayment,
  readPayments,
  deletePayment,
} from "../models/payment/PaymentModel.js";
import { paymentValidation } from "../middlewares/joiMiddleware.js";

//create payment
router.post("/",  async (req, res, next) => {
  try {
    const { name } = req.body;
    if (name.length && typeof name === "string") {
      const obj = {
        name,
        slug: slugify(name, {
          lower: true,
          trim: true,
        }),
      };

      const result = await createNewPayment(obj);

      if (result?._id) {
        return res.json({
          status: "success",
          message: "New payment has been made",
          result,
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to complete this payment, Please type valid information",
    });
  } catch (error) {
    next(error);
  }
});

//read payment
router.get("/", async (req, res, next) => {
  try {
    const payments  = await readPayments();
    res.json({
      status: "success",
      message: "Here is the payment list",
      payments,
    });
  } catch (error) {
    next(error);
  }
});

//update payments
router.put("/", paymentValidation, async (req, res, next) => {
  try {
    const result = await updatePayment(req.body);

    if (result?._id) {
      return res.json({
        status: "success",
        message: "The payment has been updated",
        result,
      });
    }

    res.json({
      status: "error",
      message: "Unable to update the payments, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

//delete payments
router.delete("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const result = await deletePayment(_id);

  if (result?._id) {
    return res.json({
      status: "success",
      message: "The payment has been deleted successfully",
    });
  }

  try {
    res.json({
      status: "error",
      message: "Unable to delete the payment, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
