export const getKeyName = (...args: string[]) => {
  return `bites:${args.join(":")}`;
};

export const getUserRefreshTokenKey = (userId: string) => {
  return getKeyName("users", userId, "refresh_token");
};

export const getUserSessionKey = (userId: string, sessionId: string) => {
  return getKeyName("users", userId, "sessions", sessionId);
};

export const getRestaurantKeyName = (restaurantId: string) =>
  getKeyName("restaurant", restaurantId);

export const getRestaurantReviewsId = (restaurantId: string) =>
  getKeyName("reviews", restaurantId);
export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review_details", id);
