import express from "express";
import dotenv from "dotenv";

import Utils from "./Utils/CommonUtil.js";
import Scrapper from "./Utils/Scrapper.js";

const app = express();
dotenv.config();
const port = 3000;

const url = process.env.MAIN_URL;

// middleware to parse JSON requests

app.use(express.json());
app.get("/", async (req, res) => {
  const data = Utils.setCacheIfNotAndSendRes(url, res, 60 * 60 * 24);
  res.send(data);
});

app.get("/seasonal-anime", async (req, res) => {
  const data = await Scrapper.getSeasonalAnime(url);
  res.send(data);
});

// start the server

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
