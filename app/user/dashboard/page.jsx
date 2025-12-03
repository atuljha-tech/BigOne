"use client";

import { useEffect, useState } from "react";
import CityFilter from "@/components/CityFilter";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session } = useSession();

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");

  const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata"];

  useEffect(() => {
    const loadEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
      setFiltered(data);
    };
    loadEvents();
  }, []);

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

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Hello, <span className="text-blue-600">{session?.user?.name}</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Explore events happening across major cities 🔥
        </p>
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
