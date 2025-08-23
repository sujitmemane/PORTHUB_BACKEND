import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

const initializeRedisClient = async (): Promise<RedisClientType | null> => {
  try {
    if (!client) {
      console.log("Initializing Redis client...");
      client = createClient({
        url: "redis://localhost:6379",
      });

      client.on("error", (error) => {
        console.error("Redis Client Error:", error);
      });

      client.on("connect", () => {
        console.log("✅ Redis connected");
      });

      await client.connect();
    }

    return client;
  } catch (error) {
    console.error("❌ Failed to initialize Redis client:", error);
    client = null;
    return null;
  }
};

export const RedisClient = async (): Promise<RedisClientType | null> => {
  if (!client) {
    return await initializeRedisClient();
  }
  return client;
};
export default initializeRedisClient;
