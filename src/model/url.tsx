// src/model/url.ts

import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

export default Url;
