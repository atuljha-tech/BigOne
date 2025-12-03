// app/organizer/events/[id]/page.jsx
import SeatViewer from "@/components/SeatViewer";

export default async function OrganizerEventView({ params }) {
  const id = params.id;
  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/events/${id}`);
  const event = await res.json();
  const mapRes = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/seats/get?eventId=${id}`);
  const map = await mapRes.json();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="p-4 bg-white/5 rounded">
        <h2 className="text-2xl font-bold">{event.name}</h2>
        <p className="text-sm text-gray-400">{event.city} · {event.venueName}</p>
        <p className="mt-2">{event.description}</p>
      </div>

      <div className="p-4 bg-white/5 rounded">
        <h3 className="font-semibold mb-2">Seat Map Preview</h3>
        <SeatViewer layout={map?.layout || { objects: [] }} />
      </div>
    </div>
  );
}
