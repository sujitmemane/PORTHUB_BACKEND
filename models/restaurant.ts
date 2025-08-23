import mongoose, { Schema } from "mongoose";

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cuisines: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("RestaurantModel", restaurantSchema);
