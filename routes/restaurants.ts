import express from "express";
import {
  handleCreateRestaurant,
  handleGetRestaurant,
  handlePostRestaurantReviews,
  getRestaurantReviews,
} from "../controllers/restaurants";
import { validate } from "../middlewares/validate";
import { RestaurantSchema } from "../schemas/restaurants";
import { ReviewSchema } from "../schemas/reviews";

const router = express.Router();

router.post("/", validate(RestaurantSchema), handleCreateRestaurant);
router.get("/:restaurantId", handleGetRestaurant);
router.post(
  "/:restaurantId/reviews",
  validate(ReviewSchema),
  handlePostRestaurantReviews
);

router.get("/:restaurantId/reviews", getRestaurantReviews);

export default router;
