// ✅ Updated OrderSummary Component with better error handling
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
  useProfileAddress,
  setUseProfileAddress,
  deliveryAddress,
  setDeliveryAddress,
  expectedDate,
  setExpectedDate,
  currency,
  conversionRate,
  isSubmitting,
  onBack,
  onSubmit,
}) {
  const extras = measurementsData[gender]?.[dressType]?.extras || [];
  const selectedExtras = extras.filter((ex) => ex.selected);

  // ✅ Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
      value * conversionRate
    );

  // ✅ Enhanced fetchUserAddress with comprehensive error handling
  const fetchUserAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.warn("No authentication token found");
        setDeliveryAddress("");
        return;
      }

      console.log("Fetching user address from backend...");

      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      // Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        // Get the actual response text to debug
        const responseText = await res.text();
        console.error("Non-JSON response received:", responseText.substring(0, 500));
        throw new Error(`Expected JSON, got ${contentType || 'no content-type'}. Response status: ${res.status}`);
      }

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (e) {
          console.error("Failed to parse error response as JSON");
        }
        throw new Error(`HTTP ${res.status}: ${errorData.message || errorData.error || 'Failed to fetch profile'}`);
      }

      const data = await res.json();
      console.log("Profile data received:", data);

      if (data && data.address && data.address.trim()) {
        setDeliveryAddress(data.address);
        console.log("Address set from profile:", data.address);
      } else {
        setDeliveryAddress("");
        console.warn("No valid address found in profile data");
      }

    } catch (error) {
      console.error("Error fetching profile address:", error.message);
      setDeliveryAddress("");
      
      // Show user-friendly message (you might want to add a state for this)
      // alert(`Failed to fetch address: ${error.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order Summary */}
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
            <p><strong>Currency:</strong> {currency}</p>
          </div>

          {/* Measurements */}
          <div>
            <h3 className="font-semibold mb-2">Measurements:</h3>
            <div className="text-sm space-y-1">
              {Object.entries(formData).map(([key, value]) =>
                value !== undefined && value !== null && key !== "buttons" ? (
                  <p key={key}>
                    {key}: {value}{" "}
                    {typeof value === "number" ? measurementUnit : ""}
                  </p>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Extras */}
        {selectedExtras.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Selected Extras:</h3>
            <ul className="list-disc list-inside text-sm">
              {selectedExtras.map((ex) => (
                <li key={ex.name}>
                  {ex.name} (+{formatCurrency(ex.cost)})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Promo & Total */}
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

          <div className="mt-4 pt-4 border-t text-lg font-bold text-blue-600">
            Total Amount: {formatCurrency(totalCost)}
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="md:col-span-2 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
        <div className="space-y-4">
          {/* Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useProfileAddress}
              onChange={async (e) => {
                const checked = e.target.checked;
                setUseProfileAddress(checked);

                if (checked) {
                  console.log("Checkbox checked - fetching address...");
                  await fetchUserAddress();
                } else {
                  console.log("Checkbox unchecked - clearing address");
                  setDeliveryAddress("");
                }
              }}
            />
            <span>Use address from profile</span>
          </label>

          {/* Address input */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter complete delivery address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              rows="3"
              required
            />
          </div>

          {/* Expected Date */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              Expected Delivery Date
            </label>
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
          disabled={isSubmitting || (!useProfileAddress && !deliveryAddress.trim()) || !expectedDate}
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