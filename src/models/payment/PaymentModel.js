import PaymentSchema from "./PaymentSchema.js";

export const createNewPayment = (obj) => {
  return PaymentSchema(obj).save();
};

export const readPayments = () => {
  return PaymentSchema.find();
};

export const updatePayment = (filter, obj) => {
  return PaymentSchema.findByIdAndUpdate(filter, obj, { new: true });
};

export const deletePayment = (_id) => {
  return PaymentSchema.findByIdAndDelete(_id);
};
