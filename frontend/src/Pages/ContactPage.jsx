import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaComment } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const response = await fetch("http://localhost:5000/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent! Thank you.");
        setFormData({ name: "", email: "", phone: "", query: "" });
      } else {
        setStatus("Failed to send message. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 md:p-20 flex items-center justify-center">
      <motion.div
        className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Contact Form */}
        <div className="flex-1 p-10 md:p-16 bg-gradient-to-b from-white to-gray-50">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Get in Touch
          </h1>
          <p className="text-gray-500 mb-10">
            Have a question or need support? Fill out the form below and we’ll get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute top-3 left-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <FaPhone className="absolute top-3 left-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <FaComment className="absolute top-3 left-4 text-gray-400" />
              <textarea
                name="query"
                placeholder="Your Message"
                rows="5"
                value={formData.query}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition transform hover:-translate-y-0.5"
            >
              Send Message
            </button>
          </form>

          {status && (
            <motion.p
              className="mt-5 text-center text-blue-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status}
            </motion.p>
          )}
        </div>

        {/* Map */}
        <motion.div
          className="flex-1 h-96 md:h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <iframe
            title="Weave Nest Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345092334!2d144.95373631550487!3d-37.81627974202162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1a8b8b3%3A0xf0727e787cc3a2d0!2sFederation%20Square!5e0!3m2!1sen!2sus!4v1687900000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </motion.div>
    </div>
  );
}
