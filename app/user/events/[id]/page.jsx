// app/user/events/[id]/page.jsx
import SeatViewer from "@/components/SeatViewer";
import Link from "next/link";

export default async function UserEventPage({ params }) {
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
        <div className="mt-4">
          <Link href={`/user/events/${id}/book`}><a className="px-4 py-2 bg-emerald-600 rounded">Book Tickets</a></Link>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded">
        <h3 className="font-semibold mb-2">Seat Map</h3>
        <SeatViewer layout={map?.layout || { objects: [] }} />
      </div>
    </div>
  );
}
