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
    },
  

    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Payments", paymentSchema);
