const mongoose = require("mongoose");

const MODELNAME = "venue";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    capacity: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    image_url: { type: String, default: "" },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    owner_name: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

Schema.index({ name: "text", address: "text", city: "text" });

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
