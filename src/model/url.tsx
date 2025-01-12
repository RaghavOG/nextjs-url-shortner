import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  isPasswordProtected: { type: Boolean, default: false },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

export default Url;
