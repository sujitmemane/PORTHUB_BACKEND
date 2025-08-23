import type { Request, Response } from "express";
import { Restaurant } from "../schemas/restaurants";
import RestaurantModel from "../models/restaurant";
import ReviewModel from "../models/review";
import { successResponse, errorResponse } from "../utils/responses";
import { RedisClient } from "../utils/redis-client";
import { getRestaurantKeyName, getRestaurantReviewsId } from "../utils/keys";
import { Review } from "../schemas/reviews";

export const handleCreateRestaurant = async (req: Request, res: Response) => {
  const data = req.body as Restaurant;
  try {
    const restaurant = await RestaurantModel.create(data);
    const hashData = {
      id: restaurant._id.toString(),
      name: restaurant.name,
      location: restaurant.location,
      cushines: JSON.stringify(restaurant.cuisines),
    };
    const client = await RedisClient();
    await client.hSet(
      getRestaurantKeyName(restaurant._id.toString()),
      hashData
    );
    return successResponse(
      res,
      201,
      restaurant,
      "Restaurant created successfully!"
    );
  } catch (error) {
    errorResponse(res, 500, {}, error?.message);
  }
};

export const handleGetRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const key = getRestaurantKeyName(id);
    console.log(key);
    const client = await RedisClient();

    const [viewCount, redisData] = await Promise.all([
      client!.hIncrBy(key, "viewCount", 1),
      client!.hGetAll(key),
    ]);
    console.log("Redis Data:", redisData);

    if (Object.keys(redisData).length) {
      return successResponse(
        res,
        200,
        { ...redisData, viewCount },
        "Fetched from Redis cache"
      );
    }

    const restaurant = await RestaurantModel.findById(id).lean();

    if (!restaurant) {
      return errorResponse(res, 404, {}, "Restaurant not found");
    }

    // const hashData = {
    //   id: restaurant._id.toString(),
    //   name: restaurant.name,
    //   location: restaurant.location,
    // };

    // await client.hSet(getRestaurantKeyName(id), hashData);

    return successResponse(res, 200, restaurant, "Fetched from MongoDB");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, {}, error?.message || "Server error");
  }
};

export const handlePostRestaurantReviews = async (
  req: Request,
  res: Response
) => {
  const { restaurantId } = req.params;
  const { review, rating } = req.body as Review;
  try {
    const response = await ReviewModel.create({
      restaurantId,
      rating,
      review,
    });
    const client = await RedisClient();
    const key = getRestaurantReviewsId(restaurantId);
    console.log(key);
    await client!.rPush(key, JSON.stringify(response));
    return successResponse(res, 201, response, "Review posted successfully");
  } catch (error) {
    console.error("Error posting restaurant review:", error);
    return errorResponse(res, 500, {}, "Failed to post review");
  }
};

export const getRestaurantReviews = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  try {
    const key = getRestaurantReviewsId(restaurantId);
    const client = await RedisClient();
    const isExists = await client!.exists(key);

    if (isExists) {
      const reviews = await client!.lRange(key, skip, skip + Number(limit) - 1);

      if (reviews.length === 0) {
        return errorResponse(
          res,
          404,
          {},
          "No reviews found for this restaurant"
        );
      }
      const parsedReviews = reviews.map((review) => JSON.parse(review));
      return successResponse(
        res,
        200,
        parsedReviews,
        "Fetched reviews successfully"
      );
    }
    const reviews = await ReviewModel.find({ restaurantId })
      .lean()
      .skip(skip)
      .limit(Number(limit));
    return successResponse(res, 200, reviews, "Fetched reviews successfully");
  } catch (error) {
    return errorResponse(res, 500, {}, "Failed to fetch reviews");
  }
};


export const handleDeleteRestaurantReview = async ()=>{
  const{ restaurantId, reviewId } = req.params;
  try {
    
    
  } catch (error) {
    
  }
}