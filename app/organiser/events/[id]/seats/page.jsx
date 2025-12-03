"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SeatEditorPage() {
  const { id: eventId } = useParams();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 600,
      width: 900,
      backgroundColor: "#1a1a1a",
    });
    fabricRef.current = canvas;

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedSeat(null));

    loadExistingSeatMap();

    return () => canvas.dispose();
  }, []);

  // -------------------------------------------------
  // LOAD EXISTING SEAT MAP
  // -------------------------------------------------
  async function loadExistingSeatMap() {
    try {
      const res = await fetch(`/api/seats/get?eventId=${eventId}`);
      const data = await res.json();

      if (data?.seatMap?.map) {
        fabricRef.current.loadFromJSON(data.seatMap.map, () => {
          fabricRef.current.renderAll();
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // -------------------------------------------------
  // HANDLE SEAT SELECTION
  // -------------------------------------------------
  function handleSelection(e) {
    const obj = e.selected[0];
    if (obj && obj.type === "rect") {
      setSelectedSeat({
        id: obj.id,
        number: obj.number,
        price: obj.price,
      });
    }
  }

  // -------------------------------------------------
  // ADD SEAT
  // -------------------------------------------------
  function addSeat() {
    const canvas = fabricRef.current;

    const seat = new fabric.Rect({
      width: 40,
      height: 40,
      fill: "#2ecc71",
      stroke: "#27ae60",
      strokeWidth: 2,
      left: 100,
      top: 100,
      hasControls: false,
    });

    seat.id = Date.now();
    seat.number = "";
    seat.price = "";

    canvas.add(seat);
  }

  // -------------------------------------------------
  // ADD ROW OF SEATS
  // -------------------------------------------------
  function addRow() {
    const canvas = fabricRef.current;

    let left = 100;
    for (let i = 0; i < 10; i++) {
      const seat = new fabric.Rect({
        width: 40,
        height: 40,
        fill: "#2ecc71",
        stroke: "#27ae60",
        strokeWidth: 2,
        left,
        top: 200,
        hasControls: false,
      });

      seat.id = Date.now() + i;
      seat.number = "";
      seat.price = "";

      canvas.add(seat);
      left += 50;
    }
  }

  // -------------------------------------------------
  // UPDATE SEAT DETAILS
  // -------------------------------------------------
  function updateSeatDetails(field, value) {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObject();

    if (!active) return;

    active[field] = value;

    setSelectedSeat((prev) => ({
      ...prev,
      [field]: value,
    }));

    canvas.renderAll();
  }

  // -------------------------------------------------
  // DELETE SEAT
  // -------------------------------------------------
  function deleteSeat() {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.remove(active);
    setSelectedSeat(null);
  }

  // -------------------------------------------------
  // SAVE SEAT MAP
  // -------------------------------------------------
  async function saveSeatMap() {
    const canvas = fabricRef.current;
    const map = canvas.toJSON(["id", "number", "price"]);

    const res = await fetch("/api/seats/save", {
      method: "POST",
      body: JSON.stringify({ eventId, map }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Seat map saved successfully!");
    } else {
      toast.error("Failed to save.");
    }
  }

  // -------------------------------------------------
  // UI RENDER
  // -------------------------------------------------
  return (
    <div className="flex bg-[#121212] text-white h-screen">
      {/* SIDEBAR */}
      <div className="w-80 bg-[#1e1e1e] p-5 border-r border-gray-800 flex flex-col gap-5">
        <h1 className="text-xl font-semibold mb-3">Seat Editor</h1>

        <button
          onClick={addSeat}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Add Seat
        </button>

        <button
          onClick={addRow}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Add Row (10 seats)
        </button>

        {selectedSeat && (
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <h2 className="font-medium mb-2">Selected Seat</h2>

            <label className="text-sm">Seat Number</label>
            <input
              type="text"
              value={selectedSeat.number}
              onChange={(e) => updateSeatDetails("number", e.target.value)}
              className="w-full px-2 py-1 bg-[#1e1e1e] rounded border border-gray-700 mb-3"
            />

            <label className="text-sm">Price</label>
            <input
              type="number"
              value={selectedSeat.price}
              onChange={(e) => updateSeatDetails("price", e.target.value)}
              className="w-full px-2 py-1 bg-[#1e1e1e] rounded border border-gray-700"
            />

            <button
              onClick={deleteSeat}
              className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Delete Seat
            </button>
          </div>
        )}

        <button
          onClick={saveSeatMap}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg mt-auto"
        >
          Save Seat Map
        </button>
      </div>

      {/* CANVAS */}
      <div className="flex-1 flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-lg shadow-xl border border-gray-700" />
      </div>
    </div>
  );
}
