import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  organizerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  city: { type: String },
  venueName: { type: String },
  startDate: Date,
  endDate: Date,
  description: String,
  performers: [String],
  seatMapId: { type: mongoose.Types.ObjectId, ref: "SeatMap" },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
