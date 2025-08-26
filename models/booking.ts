import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "REJECTED", "PENDING", "CANCELLED"],
      default: "PENDING",
    },
    name: String,
    email: String,
    phoneNumber: String,
    description: String,
    meetingLink: String,
    bookingDate: {
      type: Date,
      required: true,
    },
    slot: {
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
