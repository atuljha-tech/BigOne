// components/SeatEditor.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaChair,
  FaRupeeSign,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaLayerGroup,
  FaMousePointer,
  FaRegEdit,
  FaRegClone,
  FaEraser,
  FaUndo,
  FaRedo
} from 'react-icons/fa';
import { TbLayoutGrid, TbLayoutRows } from 'react-icons/tb';

const SeatEditor = ({ onSaveLayout, initialLayout }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatProperties, setSeatProperties] = useState({
    seatNo: '',
    price: '',
    category: 'regular',
    status: 'available'
  });
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState('select');

  // Color scheme based on BookMyShow style
  const colorScheme = {
    regular: { bg: '#4CAF50', text: '#FFFFFF', border: '#388E3C' },
    premium: { bg: '#FF9800', text: '#FFFFFF', border: '#F57C00' },
    vip: { bg: '#9C27B0', text: '#FFFFFF', border: '#7B1FA2' },
    booked: { bg: '#F44336', text: '#FFFFFF', border: '#D32F2F' },
    reserved: { bg: '#FFC107', text: '#000000', border: '#FFA000' },
    available: { bg: '#E3F2FD', text: '#1976D2', border: '#2196F3' }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas with better settings
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      selection: true,
      backgroundColor: '#1a1a2e',
      preserveObjectStacking: true,
      selectionColor: 'rgba(255, 255, 255, 0.3)',
      selectionBorderColor: '#00BCD4',
      selectionLineWidth: 2
    });

    // Set initial dimensions
    fabricCanvasRef.current.setDimensions({
      width: 800,
      height: 600
    });

    // Grid background
    addGrid();

    // Load initial layout if provided
    if (initialLayout) {
      loadLayout(initialLayout);
    }

    // Add event listeners
    fabricCanvasRef.current.on('mouse:down', handleCanvasClick);
    fabricCanvasRef.current.on('selection:created', handleSelection);
    fabricCanvasRef.current.on('selection:updated', handleSelection);
    fabricCanvasRef.current.on('selection:cleared', handleDeselection);
    fabricCanvasRef.current.on('object:moving', updateSeatTextPosition);
    fabricCanvasRef.current.on('object:scaling', updateSeatTextPosition);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  const addGrid = () => {
    const gridSize = 20;
    const gridColor = 'rgba(255, 255, 255, 0.05)';
    
    for (let i = 0; i < fabricCanvasRef.current.width / gridSize; i++) {
      const verticalLine = new fabric.Line([i * gridSize, 0, i * gridSize, fabricCanvasRef.current.height], {
        stroke: gridColor,
        selectable: false,
        evented: false
      });
      fabricCanvasRef.current.add(verticalLine);
    }
    
    for (let i = 0; i < fabricCanvasRef.current.height / gridSize; i++) {
      const horizontalLine = new fabric.Line([0, i * gridSize, fabricCanvasRef.current.width, i * gridSize], {
        stroke: gridColor,
        selectable: false,
        evented: false
      });
      fabricCanvasRef.current.add(horizontalLine);
    }
  };

  const loadLayout = (layoutData) => {
    const objects = layoutData.objects || [];
    objects.forEach(obj => {
      const seat = createSeatObject(obj.left, obj.top, obj.width, obj.height, obj.data);
      fabricCanvasRef.current.add(seat);
    });
    fabricCanvasRef.current.renderAll();
  };

  const createSeatObject = (left, top, width = 60, height = 60, data) => {
    const colors = colorScheme[data?.status] || colorScheme[data?.category] || colorScheme.available;
    
    // Rounded seat rectangle
    const seat = new fabric.Rect({
      left: left || 100,
      top: top || 100,
      width: width,
      height: height,
      rx: 8, // Border radius
      ry: 8,
      fill: colors.bg,
      stroke: colors.border,
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      }),
      data: data || {
        seatNo: `S${Date.now().toString().slice(-4)}`,
        price: 100,
        category: 'regular',
        status: 'available'
      },
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerColor: '#00BCD4',
      transparentCorners: false,
      cornerSize: 12
    });

    // Add seat number and price text
    const seatText = new fabric.Text(seat.data.seatNo || 'S01', {
      left: seat.left + seat.width / 2,
      top: seat.top + seat.height / 2 - 8,
      fontSize: 14,
      fontWeight: 'bold',
      fill: colors.text,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    const priceText = new fabric.Text(`₹${seat.data.price || '0'}`, {
      left: seat.left + seat.width / 2,
      top: seat.top + seat.height / 2 + 12,
      fontSize: 11,
      fill: colors.text,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      opacity: 0.9
    });

    // Group seat with its text
    const group = new fabric.Group([seat, seatText, priceText], {
      left: seat.left,
      top: seat.top,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      data: seat.data
    });

    // Store text references
    group.seatText = seatText;
    group.priceText = priceText;
    group.seatRect = seat;

    return group;
  };

  const updateSeatTextPosition = (e) => {
    const obj = e.target;
    if (obj && obj.type === 'group' && obj.seatText && obj.priceText) {
      const seatRect = obj.seatRect;
      obj.seatText.set({
        left: seatRect.left + seatRect.width / 2,
        top: seatRect.top + seatRect.height / 2 - 8
      });
      obj.priceText.set({
        left: seatRect.left + seatRect.width / 2,
        top: seatRect.top + seatRect.height / 2 + 12
      });
    }
  };

  const addSeat = () => {
    const seat = createSeatObject(100, 100);
    fabricCanvasRef.current.add(seat);
    fabricCanvasRef.current.setActiveObject(seat);
    updateSeatProperties(seat.data);
  };

  const addRow = (direction = 'horizontal') => {
    const startX = 100;
    const startY = 200;
    const spacing = 15;
    const seatsPerRow = 8;
    
    for (let i = 0; i < seatsPerRow; i++) {
      const x = direction === 'horizontal' ? startX + (i * (60 + spacing)) : startX;
      const y = direction === 'vertical' ? startY + (i * (60 + spacing)) : startY;
      
      const seat = createSeatObject(x, y, 60, 60, {
        seatNo: `${direction === 'horizontal' ? 'R' : 'C'}1S${i + 1}`,
        price: direction === 'horizontal' ? 150 : 200,
        category: direction === 'horizontal' ? 'regular' : 'premium',
        status: 'available'
      });
      fabricCanvasRef.current.add(seat);
    }
    fabricCanvasRef.current.renderAll();
  };

  const addBlock = () => {
    const rows = 4;
    const cols = 6;
    const spacing = 10;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seat = createSeatObject(
          150 + (c * (60 + spacing)),
          150 + (r * (60 + spacing)),
          60,
          60,
          {
            seatNo: `R${r + 1}S${c + 1}`,
            price: r === 0 ? 200 : 150, // First row premium
            category: r === 0 ? 'premium' : 'regular',
            status: 'available'
          }
        );
        fabricCanvasRef.current.add(seat);
      }
    }
    fabricCanvasRef.current.renderAll();
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all seats? This action cannot be undone.')) {
      // Remove all objects except the grid lines
      const objects = fabricCanvasRef.current.getObjects();
      objects.forEach(obj => {
        if (obj.type !== 'line') { // Keep grid lines
          fabricCanvasRef.current.remove(obj);
        }
      });
      fabricCanvasRef.current.renderAll();
      setSelectedSeat(null);
      setSeatProperties({
        seatNo: '',
        price: '',
        category: 'regular',
        status: 'available'
      });
    }
  };

  const handleCanvasClick = (options) => {
    if (options.target) {
      setSelectedSeat(options.target);
      updateSeatProperties(options.target.data);
    } else {
      handleDeselection();
    }
  };

  const handleSelection = (options) => {
    if (options.selected[0]) {
      setSelectedSeat(options.selected[0]);
      updateSeatProperties(options.selected[0].data);
    }
  };

  const handleDeselection = () => {
    setSelectedSeat(null);
    setSeatProperties({
      seatNo: '',
      price: '',
      category: 'regular',
      status: 'available'
    });
  };

  const updateSeatProperties = (data) => {
    setSeatProperties({
      seatNo: data?.seatNo || '',
      price: data?.price || '',
      category: data?.category || 'regular',
      status: data?.status || 'available'
    });
  };

  const saveSeatProperties = () => {
    if (!selectedSeat) return;

    // Update seat data
    selectedSeat.data = {
      ...selectedSeat.data,
      ...seatProperties
    };

    // Update colors
    const colors = colorScheme[selectedSeat.data.status] || colorScheme[selectedSeat.data.category];
    selectedSeat.seatRect.set({
      fill: colors.bg,
      stroke: colors.border
    });

    // Update text
    selectedSeat.seatText.set({
      text: seatProperties.seatNo,
      fill: colors.text
    });

    selectedSeat.priceText.set({
      text: `₹${seatProperties.price}`,
      fill: colors.text
    });

    fabricCanvasRef.current.renderAll();
  };

  const duplicateSeat = () => {
    if (!selectedSeat) return;
    
    const newSeat = fabric.util.object.clone(selectedSeat);
    newSeat.set({
      left: selectedSeat.left + 70,
      top: selectedSeat.top + 70,
      data: {
        ...selectedSeat.data,
        seatNo: `${selectedSeat.data.seatNo}-copy`
      }
    });
    
    // Update text for new seat
    newSeat.seatText.set('text', newSeat.data.seatNo);
    newSeat.priceText.set('text', `₹${newSeat.data.price}`);
    
    fabricCanvasRef.current.add(newSeat);
    fabricCanvasRef.current.setActiveObject(newSeat);
    setSelectedSeat(newSeat);
    updateSeatProperties(newSeat.data);
  };

  const saveLayout = () => {
    const objects = fabricCanvasRef.current.getObjects()
      .filter(obj => obj.type === 'group')
      .map(group => ({
        type: 'group',
        left: group.left,
        top: group.top,
        width: group.seatRect.width,
        height: group.seatRect.height,
        data: group.data
      }));

    const layoutData = {
      objects,
      width: fabricCanvasRef.current.width,
      height: fabricCanvasRef.current.height
    };

    if (onSaveLayout) {
      onSaveLayout(layoutData);
    }
    
    // Show success feedback
    alert('Layout saved successfully!');
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvasRef.current.setZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
    fabricCanvasRef.current.setZoom(newZoom);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaChair className="text-3xl text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold">Premium Seat Editor</h1>
              <p className="text-sm text-gray-300">Design your venue layout like a pro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
              <span className="text-sm">Zoom: {Math.round(zoom * 100)}%</span>
              <button onClick={zoomOut} className="p-1 hover:bg-white/10 rounded">
                <FaTimesCircle />
              </button>
              <button onClick={zoomIn} className="p-1 hover:bg-white/10 rounded">
                <FaPlus />
              </button>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              <FaEraser />
              <span className="font-semibold">Clear All</span>
            </button>
            <button
              onClick={saveLayout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              <FaSave />
              <span className="font-semibold">Save Layout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4">
          <ToolButton 
            onClick={addSeat}
            icon={<FaChair />}
            tooltip="Single Seat"
          />
          <ToolButton 
            onClick={() => addRow('horizontal')}
            icon={<TbLayoutRows />}
            tooltip="Add Row"
          />
          <ToolButton 
            onClick={addBlock}
            icon={<TbLayoutGrid />}
            tooltip="Add Block"
          />
          <div className="h-px w-8 bg-gray-600 my-2"></div>
          <ToolButton 
            onClick={duplicateSeat}
            icon={<FaRegClone />}
            tooltip="Duplicate Seat"
            disabled={!selectedSeat}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2 shadow-2xl">
            <div className="border-2 border-gray-600 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef} 
                className="cursor-default"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
                }}
              />
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {Object.entries(colorScheme).map(([key, color]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color.bg, border: `2px solid ${color.border}` }}
                  ></div>
                  <span className="text-sm capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaRegEdit />
              Seat Properties
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {selectedSeat ? 'Edit selected seat' : 'Select a seat to edit'}
            </p>
          </div>

          {selectedSeat ? (
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-6">
                {/* Seat Preview */}
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl mb-2"
                      style={{
                        backgroundColor: colorScheme[seatProperties.status]?.bg || colorScheme[seatProperties.category]?.bg,
                        border: `3px solid ${colorScheme[seatProperties.status]?.border || colorScheme[seatProperties.category]?.border}`
                      }}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg" style={{ color: colorScheme[seatProperties.status]?.text || colorScheme[seatProperties.category]?.text }}>
                          {seatProperties.seatNo || 'S01'}
                        </div>
                        <div className="text-xs mt-1" style={{ color: colorScheme[seatProperties.status]?.text || colorScheme[seatProperties.category]?.text }}>
                          ₹{seatProperties.price || '0'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Live Preview</p>
                  </div>
                </div>

                {/* Properties Form */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-300">
                      <FaTags />
                      Seat Number
                    </label>
                    <input
                      type="text"
                      value={seatProperties.seatNo}
                      onChange={(e) => setSeatProperties({...seatProperties, seatNo: e.target.value})}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A12, B05"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-300">
                      <FaRupeeSign />
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={seatProperties.price}
                      onChange={(e) => setSeatProperties({...seatProperties, price: e.target.value})}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-300">
                      <FaChair />
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['regular', 'premium', 'vip'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSeatProperties({...seatProperties, category: cat})}
                          className={`p-2 rounded-lg border-2 capitalize ${seatProperties.category === cat ? 'border-blue-500' : 'border-gray-700'} bg-gray-900 hover:bg-gray-800 transition-colors`}
                          style={{
                            backgroundColor: seatProperties.category === cat ? colorScheme[cat].bg : '',
                            color: seatProperties.category === cat ? colorScheme[cat].text : ''
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-300">
                      <FaCheckCircle />
                      Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['available', 'reserved', 'booked'].map((stat) => (
                        <button
                          key={stat}
                          onClick={() => setSeatProperties({...seatProperties, status: stat})}
                          className={`p-2 rounded-lg border-2 capitalize ${seatProperties.status === stat ? 'border-blue-500' : 'border-gray-700'} bg-gray-900 hover:bg-gray-800 transition-colors`}
                          style={{
                            backgroundColor: seatProperties.status === stat ? colorScheme[stat].bg : '',
                            color: seatProperties.status === stat ? colorScheme[stat].text : ''
                          }}
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-700 space-y-3">
                  <button
                    onClick={saveSeatProperties}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Update Seat
                  </button>
                  
                  <button
                    onClick={duplicateSeat}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <FaRegClone />
                    Duplicate Seat
                  </button>
                  
                  <button
                    onClick={() => {
                      if (selectedSeat) {
                        fabricCanvasRef.current.remove(selectedSeat);
                        fabricCanvasRef.current.renderAll();
                        setSelectedSeat(null);
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Delete Seat
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 mb-4">
                <FaMousePointer className="text-3xl text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Seat Selected</h3>
              <p className="text-gray-400 mb-6">
                Click on a seat to edit its properties or add a new seat from the toolbar
              </p>
              <button
                onClick={addSeat}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                <FaPlus />
                <span>Create First Seat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon, onClick, active = false, tooltip, disabled = false }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
          active 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg scale-110' 
            : 'bg-gray-900 hover:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <span className={`text-lg ${active ? 'text-white' : 'text-gray-300'}`}>
          {icon}
        </span>
      </button>
      {tooltip && (
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default SeatEditor;