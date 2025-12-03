import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  seats: [{ seatNo: String, price: Number, groupId: String }],
  amount: Number,
  paymentProvider: String,
  paymentId: String,
  status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
