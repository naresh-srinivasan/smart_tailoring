import React from "react";

export default function GenderSelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-lg text-gray-700 font-medium">Select your gender:</p>
      <div className="flex gap-8 flex-wrap justify-center">
        {["Men", "Women"].map((g) => (
          <button
            key={g}
            onClick={() => onSelect(g)}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
