"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditEventPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [eventData, setEventData] = useState({
    title: "",
    city: "",
    description: "",
    category: "",
    venue: "",
    startDate: "",
    endDate: "",
    guests: "",
    banner: "",
  });

  // Fetch event details
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEventData({
          title: data.title,
          city: data.city,
          description: data.description,
          category: data.category,
          venue: data.venue,
          startDate: data.startDate?.slice(0, 10),
          endDate: data.endDate?.slice(0, 10),
          guests: data.guests || "",
          banner: data.banner || "",
        });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load event!");
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/events/${id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Event updated successfully!");
      router.push(`/organiser/events/${id}`);
    } else {
      toast.error(data.message || "Update failed");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Edit Event — <span className="text-gray-800">{eventData.title}</span>
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-md border"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Event Title</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block font-semibold mb-1">Banner Image URL</label>
          <input
            type="text"
            name="banner"
            value={eventData.banner}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* City */}
        <div>
          <label className="block font-semibold mb-1">City</label>
          <input
            type="text"
            name="city"
            value={eventData.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block font-semibold mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option>Concert</option>
            <option>Seminar</option>
            <option>Comedy Show</option>
            <option>Fest</option>
            <option>Workshop</option>
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="block font-semibold mb-1">Guests / Performers</label>
          <input
            type="text"
            name="guests"
            value={eventData.guests}
            onChange={handleChange}
            placeholder="Comma separated names"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border px-3 py-2 rounded-lg"
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          disabled={saving}
          className="bg-blue-600 w-full py-3 rounded-xl text-white font-semibold hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
