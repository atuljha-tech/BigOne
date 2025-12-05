"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CityFilter from "@/components/CityFilter";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import { LogOut } from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata"];

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
        
        // Check if user is regular user
        if (userData.role !== 'user') {
          console.log('❌ User is not a regular user, redirecting...');
          router.push('/auth/direct-login');
          return;
        }
        
        setUser(userData);
        console.log('✅ User logged in:', userData.email);

        // Load all events
        const res = await fetch("/api/events");
        const data = await res.json();
        
        setEvents(data);
        setFiltered(data);
        setLoading(false);
      } catch (error) {
        console.log("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Filter Logic
  useEffect(() => {
    let temp = [...events];

    // City filter
    if (selectedCity !== "All") {
      temp = temp.filter((ev) => ev.city === selectedCity);
    }

    // Search filter
    if (search.trim() !== "") {
      temp = temp.filter((ev) =>
        ev.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [selectedCity, search, events]);

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
        <p className="mt-2">Please login to access the dashboard</p>
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, <span className="text-blue-600">{user.name || user.email}</span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Explore events happening across major cities 🔥
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Search + City Filter */}
      <div className="flex flex-col md:flex-row gap-5 mb-10">
        <div className="flex-1">
          <SearchBar value={search} onChange={(val) => setSearch(val)} />
        </div>

        <CityFilter
          cities={cities}
          selected={selectedCity}
          onChange={(c) => setSelectedCity(c)}
        />
      </div>

      {/* Events Grid */}
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">
        Events For You
      </h2>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white border rounded-2xl shadow">
          No events found 😔  
          <br />
          <span className="text-sm text-gray-400">
            Try changing the city or search keyword
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}

    </div>
  );
}