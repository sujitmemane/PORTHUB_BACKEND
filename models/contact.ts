import { Schema } from "mongoose";

const contactSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  email: { type: String },
  location: { type: String },
  phoneNumber: { type: String },
  availabilityStatus: {
    type: String,
    enum: ["Open to work", "Freelance Available", "Not Available"],
    default: "Open to work",
  },

  meetingLink: { type: String },
  vCardLink: { type: String },
});
