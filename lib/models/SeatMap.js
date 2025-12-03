import mongoose from "mongoose";

const SeatMapSchema = new mongoose.Schema({
  eventId: { type: mongoose.Types.ObjectId, ref: "Event", required: true },
  layout: { type: Object, required: true }, // fabric JSON
  width: Number,
  height: Number
}, { timestamps: true });

export default mongoose.models.SeatMap || mongoose.model("SeatMap", SeatMapSchema);
