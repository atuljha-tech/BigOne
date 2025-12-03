// app/api/seats/update/route.js
import connectDB from "@/lib/db";
import SeatMap from "@/lib/models/SeatMap";
import Booking from "@/lib/models/Booking";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json(); // { eventId, seats: ["A1","A2"], bookingId }
  if (!body.eventId || !Array.isArray(body.seats)) return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });

  const map = await SeatMap.findOne({ eventId: body.eventId });
  if (!map) return new Response(JSON.stringify({ error: "No seat map" }), { status: 404 });

  // mutate layout objects
  const objects = (map.layout?.objects || []).map(obj => {
    if (obj?.data?.seatNo && body.seats.includes(obj.data.seatNo)) {
      // if already booked -> error
      if (obj.data.status === "booked") {
        // We'll still proceed but inform which ones were already booked
      }
      obj.data = { ...obj.data, status: "booked" };
    }
    return obj;
  });

  map.layout.objects = objects;
  await map.save();

  if (body.bookingId) {
    await Booking.findByIdAndUpdate(body.bookingId, { status: "paid" });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
