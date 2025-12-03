// app/api/booking/verify/route.js
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import SeatMap from "@/lib/models/SeatMap";

export async function POST(req) {
  await connectDB();
  const body = await req.json(); // { bookingId, paymentId, seats }
  if (!body.bookingId || !body.paymentId) return new Response(JSON.stringify({ error: "Invalid" }), { status: 400 });

  const booking = await Booking.findById(body.bookingId);
  if (!booking) return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });

  booking.paymentId = body.paymentId;
  booking.status = "paid";
  await booking.save();

  // mark seats in seatMap as booked
  if (Array.isArray(body.seats) && body.seats.length) {
    const map = await SeatMap.findOne({ eventId: booking.eventId });
    if (map) {
      map.layout.objects = (map.layout.objects || []).map(obj => {
        if (obj?.data?.seatNo && body.seats.includes(obj.data.seatNo)) obj.data.status = "booked";
        return obj;
      });
      await map.save();
    }
  }

  return new Response(JSON.stringify({ success: true, booking }), { status: 200 });
}
