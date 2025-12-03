import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <Link
      href={`/user/events/${event._id}`}
      className="rounded-2xl bg-white/10 backdrop-blur shadow-lg border border-white/20
      hover:scale-[1.02] transition block overflow-hidden"
    >
      <img
        src={event.banner || "/images/default-event.jpg"}
        alt={event.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 text-white">
        <h2 className="text-xl font-bold">{event.name}</h2>

        <div className="flex items-center gap-2 text-gray-300 mt-2">
          <MapPin size={16} />
          <span>{event.city}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 mt-1">
          <Calendar size={16} />
          <span>{event.date}</span>
        </div>

        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded-xl">
          View Event
        </button>
      </div>
    </Link>
  );
}
