import mongoose, { Schema } from "mongoose";

const FONT_FAMILIES = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Poppins, sans-serif",
  "Playfair Display, serif",
  "Fira Code, monospace",
];

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  isOnboardingCompleted: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  banner: {
    bgColor: String,

    bgText: String,
  },
  theme: {
    fontFamily: {
      type: String,
      enum: FONT_FAMILIES,
      default: "Inter, sans-serif",
    },
    primaryColor: { type: String, default: "#111111" },
    brandColor: { type: String, default: "#FFCC00" },
  },
});

export default mongoose.model("User", userSchema);
