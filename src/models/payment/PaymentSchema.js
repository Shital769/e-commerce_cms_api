import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },

    name: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Payments", paymentSchema);
