// components/SeatViewer.jsx
'use client';
import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function SeatViewer({ layout }) {
  const ref = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const c = new fabric.StaticCanvas(ref.current, { selection: false, backgroundColor: "#071027" });
    fabricRef.current = c;
    const width = layout?.width || 900;
    const height = layout?.height || 600;
    c.setDimensions({ width, height });

    (layout?.objects || []).forEach(o => {
      const rect = new fabric.Rect({
        left: o.left, top: o.top, width: o.width, height: o.height, rx: 8, ry: 8,
        fill: o.data?.status === 'booked' ? '#F44336' : (o.data?.category === 'premium' ? '#FF9800' : '#4CAF50'),
        stroke: "#111", strokeWidth: 2, selectable: false
      });
      const seatText = new fabric.Text(o.data?.seatNo || 'S', { left: o.left + o.width/2, top: o.top + o.height/2 - 8, originX: 'center', originY: 'center', fontSize: 12, fill: "#fff", selectable: false });
      const priceText = new fabric.Text(`₹${o.data?.price || 0}`, { left: o.left + o.width/2, top: o.top + o.height/2 + 12, originX: 'center', originY: 'center', fontSize: 10, fill: "#fff", selectable: false });
      const group = new fabric.Group([rect, seatText, priceText], { left: o.left, top: o.top, selectable: false });
      c.add(group);
    });

    c.renderAll();
    return () => c.dispose();
  }, [layout]);

  return <canvas ref={ref} />;
}
