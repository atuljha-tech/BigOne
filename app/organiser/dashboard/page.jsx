"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, CalendarDays, PlusCircle, Users, Edit } from "lucide-react";
import { useSession } from "next-auth/react";

export default function OrganizerDashboard() {
  const { data: session } = useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const eRes = await fetch("/api/events");
        const eventsData = await eRes.json();

        setEvents(eventsData);

        // Fake stats (replace with actual API)
        setStats({
          totalEvents: eventsData?.length || 0,
          totalBookings: eventsData.reduce(
            (acc, ev) => acc + (ev.bookings || 0),
            0
          ),
          revenue: eventsData.reduce(
            (acc, ev) => acc + (ev.revenue || 0),
            0
          ),
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{session?.user?.name}</span>
        </h1>

        <Link
          href="/organizer/events/create"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PlusCircle size={20} /> Create Event
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow rounded-2xl border hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-600">Total Events</h2>
            <CalendarDays className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-3">{stats.totalEvents}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-2xl border hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-600">Total Bookings</h2>
            <Users className="text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-3">{stats.totalBookings}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-2xl border hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-600">Revenue</h2>
            <BarChart3 className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold mt-3">₹{stats.revenue}</p>
        </div>
      </div>

      {/* Events List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Your Events
      </h2>

      {events.length === 0 ? (
        <div className="text-gray-600 text-center py-10 border rounded-2xl bg-white shadow">
          You haven't created any events yet
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white shadow border rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Banner */}
              {ev.banner ? (
                <img
                  src={ev.banner}
                  alt="Banner"
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gray-200"></div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">
                  {ev.title}
                </h3>
                <p className="text-gray-600 mt-1">{ev.city}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(ev.startDate).toDateString()} →{" "}
                  {new Date(ev.endDate).toDateString()}
                </p>

                {/* Actions */}
                <div className="mt-5 flex justify-between">
                  <Link
                    href={`/organizer/events/${ev._id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/organizer/events/${ev._id}/edit`}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Edit size={18} /> Edit
                  </Link>

                  <Link
                    href={`/organizer/events/${ev._id}/seats`}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Seat Map
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
