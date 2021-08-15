import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name."],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long"],
    },
    account: {
      type: String,
      required: [true, "Please add your phone or email."],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password."],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
      type: String,
      default: "user",
    },
    type: {
      type: String,
      default: "normal",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
