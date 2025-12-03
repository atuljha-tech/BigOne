import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";

export async function GET(req, { params }) {
  await dbConnect();

  const event = await Event.findById(params.id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, event });
}
