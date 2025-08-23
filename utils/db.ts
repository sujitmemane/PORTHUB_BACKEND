import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "FOOD",
    });
    console.log("MongoDB connected:", mongo.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
