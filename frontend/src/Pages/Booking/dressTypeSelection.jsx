import React from "react";

export default function DressTypeSelection({
  gender,
  onBack,
  onSelect,
  measurementsData,
}) {
  const types = Object.keys(measurementsData[gender] || {});

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg text-gray-700 font-medium">Select {gender} dress type:</p>
      <div className="flex gap-6 flex-wrap justify-center">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="px-8 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition font-medium transform hover:scale-105"
          >
            {type}
          </button>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition text-lg font-bold flex items-center gap-2"
      >
        ← Back
      </button>
    </div>
  );
}
