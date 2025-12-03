// components/SeatBooking.jsx
'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function SeatBooking({ eventId }) {
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    axios.get(`/api/seats/get?eventId=${eventId}`).then(r => setMap(r.data));
  }, [eventId]);

  const toggleSeat = (obj) => {
    if (obj.data.status === "booked") return;
    setSelected(prev => {
      const exists = prev.find(s => s.seatNo === obj.data.seatNo);
      if (exists) return prev.filter(p => p.seatNo !== obj.data.seatNo);
      return [...prev, { seatNo: obj.data.seatNo, price: Number(obj.data.price || 0) }];
    });
  };

  const createRazorpayOrder = async (amount) => {
    const res = await axios.post('/api/payments', { amount });
    return res.data;
  };

  const handlePay = async () => {
    if (!selected.length) return alert("Select seats");
    setLoading(true);
    try {
      const amount = selected.reduce((s,i)=>s + (i.price || 0), 0);
      // create booking pending
      const bookingRes = await axios.post('/api/booking', { eventId, seats: selected, amount });
      const booking = bookingRes.data;
      // create razorpay order
      const order = await createRazorpayOrder(amount);
      // open checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EventMaster",
        description: "Ticket purchase",
        order_id: order.id,
        handler: async function(response) {
          // verify and mark booking paid & mark seats booked
          await axios.post('/api/booking/verify', { bookingId: booking._id, paymentId: response.razorpay_payment_id, seats: selected.map(s=>s.seatNo) });
          await axios.post('/api/seats/update', { eventId, seats: selected.map(s=>s.seatNo), bookingId: booking._id });
          alert("Payment success! Booking confirmed.");
          window.location.reload();
        },
        prefill: { name: "", email: "" },
        theme: { color: "#0b84ff" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="bg-white/5 p-4 rounded">
          <h3 className="font-semibold mb-3">Seats</h3>
          <div className="flex flex-wrap gap-2">
            {(map?.layout?.objects || []).map((o) => {
              const seatNo = o.data?.seatNo;
              const price = o.data?.price;
              const status = o.data?.status;
              const isSelected = selected.some(s => s.seatNo === seatNo);
              const classes = status === "booked" ? "bg-red-600" : isSelected ? "bg-yellow-400 text-black" : "bg-green-600";
              return (
                <button key={seatNo} disabled={status === "booked"} onClick={() => toggleSeat(o)}
                  className={`px-3 py-2 rounded text-sm ${classes}`}>
                  {seatNo} — ₹{price} {status === "booked" ? "(Booked)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white/5 p-4 rounded">
          <h4 className="font-semibold">Checkout</h4>
          <p className="text-sm text-gray-300">Selected: {selected.length}</p>
          <ul className="mt-2">
            {selected.map(s => <li key={s.seatNo}>{s.seatNo} — ₹{s.price}</li>)}
          </ul>
          <div className="mt-4">
            <button disabled={loading || selected.length === 0} onClick={handlePay} className="w-full py-3 bg-emerald-600 rounded">
              {loading ? "Processing..." : `Pay ₹${selected.reduce((s,i)=>s + (i.price || 0), 0)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
