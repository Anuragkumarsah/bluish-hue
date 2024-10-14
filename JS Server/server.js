import express from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import Utils from "./Utils/CommonUtil.js";
import Scrapper from "./Utils/Scrapper.js";

import { Worker } from "worker_threads";

import PageData from "./Models/PageData.js";

const app = express();
dotenv.config();
const port = 3000;

const url = process.env.MAIN_URL;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});
// middleware to parse JSON requests

app.use(express.json());
app.get("/", async (req, res) => {
  const data = Utils.setCacheIfNotAndSendRes(url, res, 60 * 60 * 24);
  res.send(data);
});

app.get("/seasonal-anime", async (req, res) => {
  const searchParams = req.query;

  const type = searchParams.type;

  const data = await Scrapper.getSeasonalAnime(url, type);
  res.send(data);
});

// start the server

app.listen(port, () => {
  const interval = 1000 * 60 * 60 * 24;

  const worker = new Worker("./scheduler-server.js");

  worker.on("message", (message) => {
    console.log("Scheduler Server: ", message);
  });

  worker.postMessage({ interval: interval, message: "scheduler" });

  console.log(`Example app listening at http://localhost:${port}`);
  console.log("Scheduler started and set to 24 hrs interval");
});
