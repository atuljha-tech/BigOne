// app/user/events/[id]/book/page.jsx
'use client';
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const SeatBooking = dynamic(() => import("@/components/SeatBooking"), { ssr: false });

export default function BookPage({ params }) {
  const { id } = params;
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
      <SeatBooking eventId={id} />
    </div>
  );
}
