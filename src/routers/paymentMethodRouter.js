import express from "express";
const router = express.Router();

import {
  createNewPayment,
  updatePayment,
  readPayments,
  deletePayment,
} from "../models/payment/PaymentModel.js";
import {
  updatePaymentValidation,
  newPaymentValidation,
} from "../middlewares/joiMiddleware.js";

//create payment
router.post("/", newPaymentValidation, async (req, res, next) => {
  try {
    const { _id } = await createNewPayment(req.body);

    _id
      ? res.json({
          status: "success",
          message: "Payment has been added",
        })
      : res.json({
          status: "error",
          message:
            "Error! Sorry we are unable to add new payment method. Please try again later",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "This category has been created, change the name and try again later";
    }
    next(error);
  }
});

//read payment
router.get("/", async (req, res, next) => {
  try {
    const payments = await readPayments();
    res.json({
      status: "success",
      message: "Here is the payment list",
     result: payments,
    });
  } catch (error) {
    next(error);
  }
});

//update payments
router.put("/", updatePaymentValidation, async (req, res, next) => {
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
