// app/api/booking/route.js
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // allow guest booking (token optional) but prefer logged in
  const body = await req.json(); // { eventId, seats: [{seatNo, price}], amount }
  if (!body.eventId || !Array.isArray(body.seats) || body.seats.length === 0 || !body.amount) {
    return new Response(JSON.stringify({ error: "Invalid booking payload" }), { status: 400 });
  }

  const booking = await Booking.create({
    eventId: body.eventId,
    userId: token?.sub || null,
    seats: body.seats,
    amount: body.amount,
    paymentProvider: body.paymentProvider || "razorpay",
    status: "pending"
  });

  return new Response(JSON.stringify(booking), { status: 201 });
}
