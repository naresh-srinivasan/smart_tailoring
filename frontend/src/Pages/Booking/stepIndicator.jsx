import React from "react";

export default function StepIndicator({ step, titles }) {
  return (
    <div className="flex justify-center items-center gap-4 mb-10 flex-wrap">
      {titles.map((title, index) => (
        <div key={title} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              step >= index + 1 ? "bg-blue-600" : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`hidden md:block font-medium ${
              step >= index + 1 ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {title}
          </span>
          {index < titles.length - 1 && (
            <div className={`w-8 h-1 ${step > index + 1 ? "bg-blue-600" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
