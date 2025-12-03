"use client";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />

      <input
        type="text"
        placeholder="Search events, artists, venues..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 
        text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none
        transition placeholder-gray-500"
      />
    </div>
  );
}
