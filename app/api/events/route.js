// app/api/events/route.js
import connectDB from "@/lib/db";   // ✅ FIXED
import Event from "@/lib/models/Event";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return Response.json(events);
  } catch (error) {
    console.error("❌ Error loading events:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
