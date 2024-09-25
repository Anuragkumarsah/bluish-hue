import { createClient } from "redis";

let isRedisConnected = true;

const client = createClient();

client.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    if (!isRedisConnected) {
      console.error("Redis server not running");
      client.disconnect();
    }
    isRedisConnected = false;
  } else console.log("Redis Client Error", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
  isRedisConnected = true;
});

try {
  if (client && isRedisConnected) await client.connect();
} catch (err) {
  isRedisConnected = false;
}

const Redis = {
  redisConnected: () => {
    return isRedisConnected;
  },
  set: async (key, value, args) => {
    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }
    if (!client || !isRedisConnected) {
      return { statusCode: 503, message: "Redis server not available" };
    }
    try {
      await client.set(key, value, args);
      return { statusCode: 200 };
    } catch (err) {
      return { statusCode: 500, message: err.message };
    }
  },

  get: async (key) => {
    if (!client || !isRedisConnected) {
      return { statusCode: 503, message: "Redis server not available" };
    }
    try {
      const value = await client.get(key);
      if (value === null) {
        return { statusCode: 404, message: "Key not found" };
      }
      return { statusCode: 200, message: value };
    } catch (err) {
      return { statusCode: 500, message: err.message };
    }
  },
};

export default Redis;
