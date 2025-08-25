import mongoose, { Schema } from "mongoose";
const userLinkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    link: { type: Schema.Types.ObjectId, ref: "Link", required: true },
    url: { type: String, required: true },
    slug: { type: String, unique: true },
    hits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("UserLink", userLinkSchema);
