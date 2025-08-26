import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["ONE_TO_ONE", "GROUP"],
      default: "ONE_TO_ONE",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      enum: [15, 30, 45, 60],
      default: 30,
    },

    availableDays: [
      {
        type: String,
        enum: [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ],
      },
    ],

    dayStart: { type: String, default: "09:00" },
    dayEnd: { type: String, default: "17:00" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
