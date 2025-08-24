// src/Subpages/Faqs.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqsData = [
  {
    question: "How do I update my profile?",
    answer: "Go to 'My Account' in the dashboard, click 'Edit Profile', update your details, and save.",
  },
  {
    question: "How can I track my orders?",
    answer: "Click on 'My Orders' in the dashboard to see all your past and current orders.",
  },
  {
    question: "How do I take accurate measurements?",
    answer: "Refer to the 'Measurement Guide' section for step-by-step instructions for each garment.",
  },
  {
    question: "How do I change my password?",
    answer: "Go to 'My Account' > 'Change Password', and follow the instructions.",
  },
  {
    question: "How do I contact support?",
    answer: "Visit 'Help & Support' in the dashboard or send us an email through the contact form.",
  },
];

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqsData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-white shadow-md rounded-xl"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-700 hover:bg-gray-100 rounded-xl"
              onClick={() => toggleFaq(index)}
            >
              {faq.question}
              {activeIndex === index ? <FiMinus /> : <FiPlus />}
            </button>
            {activeIndex === index && (
              <div className="px-6 py-4 text-gray-600 border-t border-gray-200">
                {faq.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
