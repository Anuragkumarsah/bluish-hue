import Redis from "./Redis.js";
import RequestExecutor from "./RequestExecutor.js";

const Utils = {
  setCacheIfNotAndSendRes: async (key, cacheTimeOut) => {
    const cachedData = await Redis.get(key);
    if (cachedData.statusCode === 200 && cachedData.message) {
      console.log(`Found ${key} in cache`);
      return cachedData.message;
    } else {
      if (cachedData.statusCode) {
        console.log(cachedData.statusCode, cachedData.message);
      }
      const data = await RequestExecutor.getRequest(key);
      await Redis.set(key, data, { EX: cacheTimeOut });
      return data;
    }
  },
};

export default Utils;
