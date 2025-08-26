import mongoose, { Schema, Types } from "mongoose";

interface ICategory {
  user: Types.ObjectId;
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
