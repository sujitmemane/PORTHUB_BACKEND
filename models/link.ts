import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "TWITTER",
      "GITHUB",
      "LINKEDIN",
      "PORTFOLIO",
      "MEDIUM",
      "BLOG",
      "YOUTUBE",
      "FACEBOOK",
      "INSTAGRAM",
    ],
    unique: true,
  },
  name: {
    type: String,
  },
  logo: {
    type: String,
  },
});

export default mongoose.model("Link", linkSchema);
