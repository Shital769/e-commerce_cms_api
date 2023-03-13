import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    address: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "inactive",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },

    emailVerificationCode: {
      type: String,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    refreshJWT: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Admin_user", adminSchema);
