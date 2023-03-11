import PaymentSchema from "./PaymentSchema.js";

export const createNewPayment = (obj) => {
  return PaymentSchema(obj).save();
};

export const readPayments = () => {
  return PaymentSchema.find();
};



export const updatePayment = (_id, ...rest) => {
  return PaymentSchema.findByIdAndUpdate( _id, rest);
};

export const deletePayment = (_id) => {
  return PaymentSchema.findByIdAndDelete(_id);
};
