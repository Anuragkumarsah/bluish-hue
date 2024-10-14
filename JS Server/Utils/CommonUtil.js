import Redis from "./Redis.js";
import RequestExecutor from "./RequestExecutor.js";
import { promises as fs } from "fs";

import PageData from "../Models/PageData.js";

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
      const pageData = new PageData({
        pageID: key,
        data: data,
      });
      pageData
        .save()
        .then(() => console.log(`${key} saved successfully in MongoDB`));
      await Redis.set(key, data, { EX: cacheTimeOut });
      return data;
    }
  },

  getJsonForCache: async (path) => {
    try {
      const data = await fs.readFile(path, "utf8");
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      return {};
    }
  },
};

export default Utils;
