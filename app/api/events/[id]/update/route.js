// app/api/events/[id]/update/route.js
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { getToken } from "next-auth/jwt";

export async function PUT(req, { params }) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json();
  const event = await Event.findById(params.id);
  if (!event) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  if (event.organizerId.toString() !== token.sub && token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  Object.assign(event, {
    name: body.name ?? event.name,
    city: body.city ?? event.city,
    venueName: body.venueName ?? event.venueName,
    startDate: body.startDate ? new Date(body.startDate) : event.startDate,
    endDate: body.endDate ? new Date(body.endDate) : event.endDate,
    description: body.description ?? event.description,
    performers: body.performers ?? event.performers,
    isPublished: typeof body.isPublished === "boolean" ? body.isPublished : event.isPublished
  });

  await event.save();
  return new Response(JSON.stringify(event), { status: 200 });
}
