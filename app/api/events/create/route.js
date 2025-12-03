import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { getServerSession } from "next-auth";
import nextAuthOptions from "@/lib/nextAuthOptions";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(nextAuthOptions);

  if (!session || session.user.role !== "organizer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const newEvent = await Event.create({
    ...data,
    organizer: session.user._id,
  });

  return NextResponse.json({ success: true, event: newEvent });
}
