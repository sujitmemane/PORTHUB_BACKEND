import mongoose, { Schema, Types } from "mongoose";

interface ISkill {
  category: Types.ObjectId;
  name: string;
}

const skillSchema = new Schema<ISkill>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // level: {
    //   type: String,
    //   enum: ["beginner", "intermediate", "advanced", "expert"],
    //   default: "beginner",
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
