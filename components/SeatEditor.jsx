// components/SeatEditor.jsx
'use client';
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FaPlus, FaSave, FaTrash, FaRegClone } from "react-icons/fa";

/**
 * Props:
 * - onSaveLayout(layout)  // receives layout object
 * - initialLayout (optional)
 */
export default function SeatEditor({ onSaveLayout, initialLayout }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#071027",
      selection: true,
      preserveObjectStacking: true
    });
    fabricRef.current = c;
    c.setDimensions({ width: 1000, height: 600 });

    // grid lines (non-evented)
    const gridSize = 20;
    for (let i = 0; i < c.width / gridSize; i++) {
      c.add(new fabric.Line([i * gridSize, 0, i * gridSize, c.height], { selectable: false, evented: false, stroke: "rgba(255,255,255,0.03)" }));
    }
    for (let i = 0; i < c.height / gridSize; i++) {
      c.add(new fabric.Line([0, i * gridSize, c.width, i * gridSize], { selectable: false, evented: false, stroke: "rgba(255,255,255,0.03)" }));
    }

    // load initial layout if provided
    if (initialLayout && initialLayout.objects) {
      initialLayout.objects.forEach(o => {
        // create rect + texts as group
        try {
          const rect = new fabric.Rect({
            left: o.left, top: o.top, width: o.width, height: o.height, rx: 8, ry: 8,
            fill: (o.data?.status === 'booked') ? '#F44336' : (o.data?.category === 'premium' ? '#FF9800' : '#4CAF50'),
            stroke: "#111", strokeWidth: 2
          });
          const seatText = new fabric.Text(o.data?.seatNo || 'S', { left: o.left + o.width/2, top: o.top + o.height/2 - 8, originX: 'center', originY: 'center', fontSize: 12, fill: "#fff", selectable: false, evented: false });
          const priceText = new fabric.Text(`₹${o.data?.price || 0}`, { left: o.left + o.width/2, top: o.top + o.height/2 + 12, originX: 'center', originY: 'center', fontSize: 10, fill: "#fff", selectable: false, evented: false });
          const group = new fabric.Group([rect, seatText, priceText], { left: o.left, top: o.top, hasControls: true, data: o.data || {} });
          group.seatRect = rect;
          group.seatText = seatText;
          group.priceText = priceText;
          c.add(group);
        } catch (e) {
          console.error("Load seat error", e);
        }
      });
    }

    c.on('selection:created', (e) => {
      setSelectedGroup(e.target);
    });
    c.on('selection:updated', (e) => {
      setSelectedGroup(e.target);
    });
    c.on('selection:cleared', () => setSelectedGroup(null));

    // cleanup
    return () => {
      c.dispose();
      fabricRef.current = null;
    };
  }, [initialLayout]);

  const addSeat = () => {
    const c = fabricRef.current;
    if (!c) return;
    const seatRect = new fabric.Rect({ width: 60, height: 60, fill: "#4CAF50", rx: 8, ry: 8, stroke: "#0b0b0b", strokeWidth: 2 });
    const seatNo = `S${Date.now().toString().slice(-4)}`;
    const seatText = new fabric.Text(seatNo, { fontSize: 14, originX: 'center', originY: 'center', fill: "#fff" });
    const priceText = new fabric.Text("₹100", { fontSize: 11, originX: 'center', originY: 'center', fill: "#fff" });
    const group = new fabric.Group([seatRect, seatText, priceText], { left: 100, top: 100, hasControls: true, data: { seatNo, price: 100, category: "regular", status: "available" } });
    group.seatRect = seatRect; group.seatText = seatText; group.priceText = priceText;
    c.add(group);
    c.setActiveObject(group);
    c.renderAll();
  };

  const deleteSelected = () => {
    const c = fabricRef.current;
    if (!c) return;
    const obj = c.getActiveObject();
    if (obj) {
      c.remove(obj);
      setSelectedGroup(null);
    }
  };

  const duplicateSelected = () => {
    const c = fabricRef.current;
    if (!c) return;
    const obj = c.getActiveObject();
    if (!obj) return;
    const clone = fabric.util.object.clone(obj);
    clone.set({ left: obj.left + 70, top: obj.top + 40 });
    // update seatNo
    clone.data = { ...clone.data, seatNo: `${clone.data.seatNo}_copy` };
    clone.seatText && clone.seatText.set('text', clone.data.seatNo);
    c.add(clone);
    c.setActiveObject(clone);
    c.renderAll();
  };

  const saveLayout = () => {
    const c = fabricRef.current;
    if (!c) return;
    const objects = c.getObjects().filter(o => o.type === 'group').map(g => ({
      left: g.left,
      top: g.top,
      width: g.seatRect?.width || g.width || 60,
      height: g.seatRect?.height || g.height || 60,
      data: g.data || {}
    }));
    const layout = { objects, width: c.width, height: c.height };
    if (onSaveLayout) onSaveLayout(layout);
    alert("Layout saved (to state). Call API to persist.");
  };

  const zoomIn = () => { const n = Math.min(zoom * 1.2, 3); setZoom(n); fabricRef.current.setZoom(n); };
  const zoomOut = () => { const n = Math.max(zoom / 1.2, 0.4); setZoom(n); fabricRef.current.setZoom(n); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={addSeat} className="px-3 py-2 bg-indigo-600 rounded text-white flex items-center gap-2"><FaPlus/> Add Seat</button>
        <button onClick={duplicateSelected} className="px-3 py-2 bg-gray-800 rounded text-white flex items-center gap-2"><FaRegClone/> Duplicate</button>
        <button onClick={deleteSelected} className="px-3 py-2 bg-red-600 rounded text-white flex items-center gap-2"><FaTrash/> Delete</button>
        <div className="ml-auto flex gap-2">
          <button onClick={zoomOut} className="px-3 py-2 bg-slate-700 rounded text-white">-</button>
          <div className="px-3 py-2 bg-slate-800 rounded text-white">Zoom {Math.round(zoom*100)}%</div>
          <button onClick={zoomIn} className="px-3 py-2 bg-slate-700 rounded text-white">+</button>
          <button onClick={saveLayout} className="ml-2 px-4 py-2 bg-emerald-600 rounded text-white flex items-center gap-2"><FaSave/> Save</button>
        </div>
      </div>

      <div className="border rounded overflow-auto">
        <canvas ref={canvasRef} width="1000" height="600" />
      </div>
    </div>
  );
}
