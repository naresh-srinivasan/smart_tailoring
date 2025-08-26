import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function OrderCompleted({ showConfetti, submittedOrder, resetForm }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="animate-pulse text-6xl text-center pt-20">🎉</div>
        </div>
      )}

      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center mx-4"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Completed! 🎉</h2>
          <p className="mb-4 text-gray-700">Thank you! Your order has been successfully placed.</p>

          <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg mb-3 text-center">Order Summary:</h3>
            <div className="space-y-2">
              <p><strong>Dress Type:</strong> {submittedOrder.dress_type}</p>
              <p><strong>Material:</strong> {submittedOrder.material}</p>
              <p><strong>Color:</strong> {submittedOrder.color}</p>
              <p><strong>Material Needed:</strong> {submittedOrder.material_needed}m</p>
              {submittedOrder.extras && submittedOrder.extras.length > 0 && (
                <p><strong>Extras:</strong> {submittedOrder.extras.join(", ")}</p>
              )}
              <p className="text-lg font-bold text-blue-600">
                <strong>Total Amount:</strong> ₹{submittedOrder.totalAmount}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Place New Order
            </button>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              View Orders
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
