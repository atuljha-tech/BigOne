"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, CalendarDays, PlusCircle, Users, Edit, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      // First, check if user is authenticated via cookies
      const cookies = document.cookie;
      const userSessionCookie = cookies.split('; ').find(row => row.startsWith('user-session='));
      
      if (!userSessionCookie) {
        // No session, redirect to login
        router.push('/auth/direct-login');
        return;
      }

      try {
        // Parse user data from cookie
        const sessionValue = decodeURIComponent(userSessionCookie.split('=')[1]);
        const userData = JSON.parse(sessionValue);
        
        // Check if user is organizer
        if (userData.role !== 'organizer') {
          console.log('❌ User is not an organizer, redirecting...');
          router.push('/auth/direct-login');
          return;
        }
        
        setUser(userData);
        console.log('✅ Organizer logged in:', userData.email);

        // Load events for this organizer
        const eRes = await fetch("/api/events");
        const eventsData = await eRes.json();

        // Filter events for this organizer
        const organizerEvents = eventsData.filter(event => 
          event.organizerId === userData.id || event.createdBy === userData.id
        );
        
        setEvents(organizerEvents);

        // Calculate stats
        setStats({
          totalEvents: organizerEvents.length || 0,
          totalBookings: organizerEvents.reduce((acc, ev) => acc + (ev.bookings || 0), 0),
          revenue: organizerEvents.reduce((acc, ev) => acc + (ev.revenue || 0), 0),
        });

        setLoading(false);
      } catch (error) {
        console.log("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/auth/direct-login';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">Please login as an organizer</p>
        <button
          onClick={() => router.push('/auth/direct-login')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user.name || user.email}</span>
          </h1>
          <p className="text-gray-600 mt-1">Organizer Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
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

      {/* Create Event Button */}
      <div className="mb-8">
        <Link
          href="/organiser/events/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create New Event
        </Link>
      </div>

      {/* Events List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Your Events
      </h2>

      {events.length === 0 ? (
        <div className="text-gray-600 text-center py-10 border rounded-2xl bg-white shadow">
          <p className="text-lg">You haven't created any events yet</p>
          <Link
            href="/organiser/events/create"
            className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Your First Event
          </Link>
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
                    href={`/organiser/events/${ev._id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/organiser/events/${ev._id}/edit`}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Edit size={18} /> Edit
                  </Link>

                  <Link
                    href={`/organiser/events/${ev._id}/seats`}
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