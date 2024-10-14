import mongoose from "mongoose";

const PageDataSchema = mongoose.Schema({
  pageID: { type: String, required: true, unique: true },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PageData = mongoose.model("PageData", PageDataSchema);

export default PageData;
