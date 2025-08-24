import React from "react";

export default function MeasurementsForm({
  gender,
  dressType,
  measurementsData,
  measurementUnit,
  setMeasurementUnit,
  formData,
  setFormData,
  showInstructions,
  toggleInstruction,
  handleExtraChange,
  materialNeeded,
  materialCosts,
  material,
  totalCost,
  DELIVERY_CHARGE,
  LABOUR_CHARGE,
  onBack,
  onSubmit,
}) {
  const fields = measurementsData[gender]?.[dressType]?.measurements || [];

  const onInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Unit */}
      <div className="md:col-span-2 flex flex-col gap-2">
        <label className="text-gray-700 font-medium">Measurement Unit</label>
        <select
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="cm">Centimeters (cm)</option>
          <option value="inches">Inches (in)</option>
        </select>
      </div>

      {/* Measurement Inputs */}
      {fields.map((m) => (
        <div key={m.name} className="flex flex-col gap-2 relative">
          <label className="text-gray-700 font-medium">{m.name}</label>
          <input
            type="number"
            name={m.name}
            value={formData[m.name] || ""}
            onChange={onInputChange}
            placeholder={`${m.placeholder} (${measurementUnit})`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            step="0.1"
            min="0"
            required
          />
          <button
            type="button"
            onClick={() => toggleInstruction(m.name)}
            className="absolute right-3 top-9 text-blue-500 font-bold hover:text-blue-700"
          >
            i
          </button>
          {showInstructions[m.name] && (
            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-md shadow-inner">
              {m.instruction}
            </p>
          )}
        </div>
      ))}

      {/* Material Needed */}
      {materialNeeded > 0 && (
        <div className="md:col-span-2 mt-2 p-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
          Material Needed:{" "}
          <span className="font-bold text-blue-600">{materialNeeded}m</span>
        </div>
      )}

      {/* Extras */}
      {measurementsData[gender]?.[dressType]?.extras?.length > 0 && (
        <div className="md:col-span-2 mt-4">
          <h2 className="text-xl font-semibold mb-2">Extras:</h2>
          <div className="flex flex-wrap gap-4">
            {measurementsData[gender][dressType].extras.map((ex, idx) => (
              <label
                key={ex.name}
                className="flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={!!ex.selected}
                  onChange={() => handleExtraChange(idx)}
                  className="w-4 h-4"
                />
                <span>
                  {ex.name} (+₹{ex.cost})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Bill */}
      <div className="md:col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Bill Breakdown:</h2>
        <div className="space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Base Cost:</span>
            <span>₹{measurementsData[gender]?.[dressType]?.baseCost || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Material Cost:</span>
            <span>
              ₹
              {material && materialCosts[material]
                ? (materialCosts[material] * (materialNeeded || 0)).toFixed(2)
                : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Labour Charge:</span>
            <span>₹{LABOUR_CHARGE}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>₹{DELIVERY_CHARGE}</span>
          </div>
          {measurementsData[gender]?.[dressType]?.extras
            ?.filter((ex) => ex.selected)
            .map((ex) => (
              <div key={ex.name} className="flex justify-between text-sm">
                <span>{ex.name}:</span>
                <span>₹{ex.cost}</span>
              </div>
            ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg text-blue-600">
            <span>Total:</span>
            <span>₹{totalCost}</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition text-lg font-bold flex items-center gap-2"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-yellow-600 transition font-medium"
        >
          Proceed to Summary
        </button>
      </div>
    </form>
  );
}
