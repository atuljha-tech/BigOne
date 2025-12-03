// app/organizer/events/create/page.jsx
'use client';
import { useState } from "react";
import axios from "axios";
import SeatEditor from "@/components/SeatEditor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", city: "", venueName: "", startDate: "", endDate: "", description: "" });
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.city) return alert("Name and city required");
    setLoading(true);
    try {
      // create event
      const ev = await axios.post('/api/events', form);
      const eventId = ev.data._id;
      if (layout) {
        await axios.post('/api/seats/save', { eventId, layout, width: layout.width, height: layout.height });
      }
      alert("Event created");
      router.push(`/organizer/events/${eventId}`);
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white/5 p-4 rounded">
        <h2 className="text-xl font-semibold">Create Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input placeholder="Event name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="p-3 bg-slate-900 rounded" />
          <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="p-3 bg-slate-900 rounded" />
          <input placeholder="Venue name" value={form.venueName} onChange={e=>setForm({...form, venueName: e.target.value})} className="p-3 bg-slate-900 rounded" />
          <input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="p-3 bg-slate-900 rounded" />
          <input type="date" value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} className="p-3 bg-slate-900 rounded" />
          <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="p-3 bg-slate-900 rounded col-span-2" />
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded">
        <h3 className="font-semibold mb-3">Seat Editor</h3>
        <SeatEditor onSaveLayout={(l) => setLayout(l)} />
        <p className="text-sm text-gray-400 mt-2">After designing, click Save inside editor to set layout (will be saved with event on create).</p>
      </div>

      <div className="flex justify-end">
        <button onClick={submit} disabled={loading} className="px-6 py-3 bg-emerald-600 rounded">
          {loading ? "Creating..." : "Create event"}
        </button>
      </div>
    </div>
  );
}
