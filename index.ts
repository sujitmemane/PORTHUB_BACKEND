import express from "express";
import cusinesRoutes from "./routes/cuisines.ts";
import restaurantsRoutes from "./routes/restaurants.ts";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/user.ts";
import linkRoutes from "./routes/link.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import { connectDB } from "./utils/db.ts";
import initializeRedisClient from "./utils/redis-client.ts";
import CookieParser from "cookie-parser";

import cors from "cors";

const PORT = process.env.PORT;
const app = express();
app.use(CookieParser());

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(errorHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/cusines", cusinesRoutes);
app.use("/restaurants", restaurantsRoutes);

const initApp = async () => {
  try {
    await connectDB();
    await initializeRedisClient();
    app
      .listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      })
      .on("error", (error) => {
        throw new Error(error?.message);
      });
  } catch (error) {}
};

initApp();
