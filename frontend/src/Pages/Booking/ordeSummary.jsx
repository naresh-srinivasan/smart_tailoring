import React from "react";

export default function OrderSummary({
  gender,
  dressType,
  material,
  color,
  measurementUnit,
  materialNeeded,
  collarType,
  sleeveType,
  buttonType,
  buttonColor,
  formData,
  measurementsData,
  promoCode,
  setPromoCode,
  promoError,
  discount,
  applyPromoCode,
  removePromoCode,
  totalCost,
  userProfile,
  useProfileAddress,
  setUseProfileAddress,
  deliveryAddress,
  setDeliveryAddress,
  expectedDate,
  setExpectedDate,
  isSubmitting,
  onBack,
  onSubmit,
}) {
  const extras = measurementsData[gender]?.[dressType]?.extras || [];
  const selectedExtras = extras.filter((ex) => ex.selected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary */}
      <div className="md:col-span-2 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Dress Type:</strong> {dressType}</p>
            <p><strong>Material:</strong> {material}</p>
            <p><strong>Color:</strong> {color}</p>
            <p><strong>Unit:</strong> {measurementUnit}</p>
            <p><strong>Material Needed:</strong> {materialNeeded}m</p>
            {dressType === "Shirt" && (
              <>
                <p><strong>Collar Type:</strong> {collarType}</p>
                <p><strong>Sleeve Type:</strong> {sleeveType}</p>
              </>
            )}
            {(buttonType || buttonColor) && (
              <p>
                <strong>Buttons:</strong>{" "}
                {[buttonType, buttonColor].filter(Boolean).join(" / ")}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Measurements:</h3>
            <div className="text-sm space-y-1">
              {Object.entries(formData).map(([key, value]) => (
                value !== undefined && value !== null && key !== "buttons" ? (
                  <p key={key}>
                    {key}: {value}
                    {typeof value === "number" || Number.isFinite(Number(value)) ? measurementUnit : ""}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        </div>

        {selectedExtras.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Selected Extras:</h3>
            <ul className="list-disc list-inside text-sm">
              {selectedExtras.map((ex) => (
                <li key={ex.name}>
                  {ex.name} (+₹{ex.cost})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Promo */}
        <div className="md:col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Apply Promo Code</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={discount > 0}
            />
            <button
              type="button"
              onClick={discount > 0 ? removePromoCode : applyPromoCode}
              className={`px-4 py-2 rounded-lg transition ${
                discount > 0
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {discount > 0 ? "Remove" : "Apply"}
            </button>
          </div>
          {promoError && <p className="text-red-500 mt-1">{promoError}</p>}
          {discount > 0 && (
            <p className="text-green-600 mt-1">
              Promo applied! You got {discount}% off
            </p>
          )}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-lg font-bold text-blue-600">Total Amount: ₹{totalCost}</p>
        </div>
      </div>

      {/* Delivery */}
      <div className="md:col-span-2 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useProfileAddress}
              onChange={(e) => {
                setUseProfileAddress(e.target.checked);
                if (e.target.checked) {
                  setDeliveryAddress(userProfile.address || "");
                } else {
                  setDeliveryAddress("");
                }
              }}
            />
            <span>Use address from profile</span>
            {userProfile.address && (
              <span className="text-sm text-gray-600">
                ({userProfile.address.substring(0, 50)}
                {userProfile.address.length > 50 ? "..." : ""})
              </span>
            )}
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              {useProfileAddress ? "Profile Address" : "Delivery Address"}
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter complete delivery address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              rows="3"
              required
              disabled={useProfileAddress}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Expected Delivery Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]}
              required
            />
            <p className="text-sm text-gray-600">
              *Minimum delivery time is 7 days from today
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="md:col-span-2 flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition text-lg font-bold flex items-center gap-2"
          disabled={isSubmitting}
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !deliveryAddress.trim() || !expectedDate}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-yellow-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            "Submit Order"
          )}
        </button>
      </div>
    </div>
  );
}
