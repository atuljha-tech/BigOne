// app/api/seats/get/route.js
import connectDB from "@/lib/db";
import SeatMap from "@/lib/models/SeatMap";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");
  if (!eventId) return new Response(JSON.stringify({ error: "eventId required" }), { status: 400 });

  const map = await SeatMap.findOne({ eventId }).lean();
  if (!map) return new Response(JSON.stringify(null), { status: 200 });
  return new Response(JSON.stringify(map), { status: 200 });
}
