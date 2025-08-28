// src/components/ARModel.jsx
import React, { useState } from "react";
import "@google/model-viewer";

export default function ARModel() {
  const [measurements, setMeasurements] = useState({
    chest: 36,
    waist: 30,
    height: 60,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements({ ...measurements, [name]: parseFloat(value) });
  };

  // Generate scaling from measurements
  const scaleX = measurements.chest / 36;   // Base chest = 36
  const scaleY = measurements.height / 60;  // Base height = 60
  const scaleZ = measurements.waist / 30;   // Base waist = 30

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">AR Dress Model</h2>

      {/* Form for Measurements */}
      <div className="space-y-2 mb-4">
        <input
          type="number"
          name="chest"
          value={measurements.chest}
          onChange={handleChange}
          placeholder="Chest"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="waist"
          value={measurements.waist}
          onChange={handleChange}
          placeholder="Waist"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="height"
          value={measurements.height}
          onChange={handleChange}
          placeholder="Height"
          className="border p-2 w-full"
        />
      </div>

      {/* AR Model Viewer */}
      <model-viewer
        src="/models/cube.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "500px" }}
        scale={`${scaleX} ${scaleY} ${scaleZ}`}
      ></model-viewer>
    </div>
  );
}
