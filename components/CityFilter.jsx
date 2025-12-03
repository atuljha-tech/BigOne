"use client";
export default function CityFilter({ cities, selectedCity, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        onClick={() => onChange("All")}
        className={`px-4 py-2 rounded-full text-sm transition 
        ${selectedCity === "All" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
      >
        All Cities
      </button>

      {cities.map((city) => (
        <button
          key={city}
          onClick={() => onChange(city)}
          className={`px-4 py-2 rounded-full text-sm transition
          ${selectedCity === city ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          {city}
        </button>
      ))}
    </div>
  );
}
