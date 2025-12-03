// app/api/seats/save/route.js
import connectDB from "@/lib/db";
import SeatMap from "@/lib/models/SeatMap";
import Event from "@/lib/models/Event";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json(); // { eventId, layout, width, height }
  if (!body.eventId || !body.layout) return new Response(JSON.stringify({ error: "eventId & layout required" }), { status: 400 });

  const event = await Event.findById(body.eventId);
  if (!event) return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  if (event.organizerId.toString() !== token.sub && token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const existing = await SeatMap.findOne({ eventId: body.eventId });
  if (existing) {
    existing.layout = body.layout;
    existing.width = body.width || existing.width;
    existing.height = body.height || existing.height;
    await existing.save();
    return new Response(JSON.stringify(existing), { status: 200 });
  }

  const map = await SeatMap.create({
    eventId: body.eventId,
    layout: body.layout,
    width: body.width,
    height: body.height
  });
  return new Response(JSON.stringify(map), { status: 201 });
}
