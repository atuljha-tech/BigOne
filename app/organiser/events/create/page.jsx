// app/organiser/events/create/page.jsx - UPDATED
'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SeatEditor from "@/components/SeatEditor";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: "", 
    city: "", 
    venueName: "", 
    startDate: "", 
    endDate: "", 
    description: "" 
  });
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check authentication via cookies
    const checkAuth = () => {
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
        console.log('✅ Organizer authenticated:', userData.email);
        setAuthLoading(false);
      } catch (e) {
        console.error('Error parsing session:', e);
        router.push('/auth/direct-login');
      }
    };

    checkAuth();
  }, [router]);

  const submit = async () => {
    if (!form.name || !form.city) {
      alert("Event name and city are required");
      return;
    }
    
    setLoading(true);
    try {
      // Create event
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          organizerId: user?.id // Add organizer ID from user cookie
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      const eventId = data._id;
      
      // Save seat layout if exists
      if (layout) {
        await fetch('/api/seats/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            eventId, 
            layout, 
            width: layout.width, 
            height: layout.height 
          })
        });
      }
      
      alert("Event created successfully!");
      router.push(`/organiser/events/${eventId}`);
    } catch (err) {
      console.error("Create event error:", err);
      alert(`Create failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/auth/direct-login';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">You need to be logged in as an organizer to create events.</p>
          <button
            onClick={() => router.push('/auth/direct-login')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-600 mt-2">Logged in as: {user.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/organiser/dashboard')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Event Details Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Event Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              placeholder="e.g., Annual Music Festival"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              placeholder="e.g., Mumbai"
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name
            </label>
            <input
              placeholder="e.g., National Stadium"
              value={form.venueName}
              onChange={e => setForm({...form, venueName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your event..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Seat Editor Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Seat Layout Design</h3>
          {layout && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Layout Saved ✓
            </span>
          )}
        </div>
        
        <SeatEditor onSaveLayout={(l) => setLayout(l)} />
        
        <p className="text-sm text-gray-500 mt-4">
          💡 Design your seat layout using the drawing tool above. Click "Save Layout" in the editor 
          to preview, then "Create Event" below to save everything.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <div className="flex gap-4">
          {layout && (
            <button
              onClick={() => alert(`Layout dimensions: ${layout.width}x${layout.height}`)}
              className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Preview Layout
            </button>
          )}
          
          <button
            onClick={submit}
            disabled={loading || !form.name || !form.city}
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </div>

      {/* Validation Notice */}
      {(!form.name || !form.city) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            ⚠️ Please fill in at least Event Name and City before creating the event.
          </p>
        </div>
      )}
    </div>
  );
}