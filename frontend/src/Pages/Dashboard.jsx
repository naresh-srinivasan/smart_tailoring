import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MyAccount from "../Subpages/MyAccount";
import MyOrders from "../Subpages/MyOrders";
import MeasurementGuide from "../Subpages/MeasurementGuide";
import Faqs from "../Subpages/Faqs";
import ReturnAndRefundPolicy from "../Pages/returnAndRefundPolicy";

export default function Dashboard() {
  const options = [
    { name: "My Account", key: "account" },
    { name: "My Orders", key: "orders" },
    { name: "Measurement Guide", key: "measurement-guide" },
    { name: "Faqs", key: "faqs" },
    { name: "Return & Refund Policy", key: "returnandrefundpolicy" },
    { name: "Transaction History", key: "transactions" },
  ];

  // Content map for rendering components
  const contentMap = {
    account: <MyAccount />,
    orders: <MyOrders />,
    "measurement-guide": <MeasurementGuide />,
    faqs: <Faqs />,
    "returnandrefundpolicy": <ReturnAndRefundPolicy />,
    transactions: (
      <div className="text-gray-700 text-lg">
        <h4 className="text-xl font-semibold mb-4">Transaction History</h4>
        <p>Review all your payment and transaction details.</p>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      </div>
    ),
  };

  // Default to "My Account"
  const [selected, setSelected] = useState("account");

  // Handle option click - no routing, just state change
  const handleOptionClick = (option) => {
    setSelected(option.key);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar - Always Visible */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-400 shadow-lg p-6 flex flex-col justify-between text-white">
        {/* Sidebar Header */}
        <div>
          <h2 className="text-3xl font-bold mb-8 tracking-wide">
            Dashboard
          </h2>
          
          {/* Navigation Options */}
          <div className="flex flex-col gap-3">
            {options.map((option) => (
              <motion.div
                key={option.key}
                className={`cursor-pointer px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  selected === option.key
                    ? "bg-white text-blue-600 shadow-lg"
                    : "hover:bg-white hover:text-blue-600 hover:shadow-md"
                }`}
                onClick={() => handleOptionClick(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-200 text-sm">© 2025 YourApp</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-full min-h-full"
          >
            {/* Page Title */}
            <h3 className="text-3xl font-bold text-blue-600 mb-8 tracking-wide border-b border-gray-200 pb-4">
              {options.find((opt) => opt.key === selected)?.name || "My Account"}
            </h3>
            
            {/* Component Content */}
            <div className="text-gray-700">
              {contentMap[selected] || contentMap["account"]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}