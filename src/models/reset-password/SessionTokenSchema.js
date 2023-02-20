import mongoose from "mongoose";

const sessionToken = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  association: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ResetPassword", sessionToken);
