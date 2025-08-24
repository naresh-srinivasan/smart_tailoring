import React, { useState } from "react";
import { motion } from "framer-motion";

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
    // Simulate sending
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
    setStatus("Error sending message.");}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6ba73] via-white to-[#f0f6fa] pt-20 px-10 pb-10">
      <motion.div
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-10 flex flex-col md:flex-row gap-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Contact Form */}
        <div className="flex-1">
          <h1
            className="text-4xl font-extrabold mb-8 text-[#286fad]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-lg border border-[#d6ba73] focus:outline-none focus:ring-2 focus:ring-[#d6ba73] text-[#286fad]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-lg border border-[#d6ba73] focus:outline-none focus:ring-2 focus:ring-[#d6ba73] text-[#286fad]"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-lg border border-[#d6ba73] focus:outline-none focus:ring-2 focus:ring-[#d6ba73] text-[#286fad]"
            />

            <textarea
              name="query"
              placeholder="Your Query"
              rows="5"
              value={formData.query}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-lg border border-[#d6ba73] focus:outline-none focus:ring-2 focus:ring-[#d6ba73] text-[#286fad]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#286fad] hover:bg-[#1f5685] text-white py-3 rounded-lg font-semibold text-lg transition"
            >
              Send
            </button>
          </form>

          {status && (
            <motion.p
              className="mt-5 text-center text-[#d6ba73] font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status}
            </motion.p>
          )}
        </div>

        {/* Right Side - Map */}
        <motion.div
          className="flex-1 h-96 rounded-2xl overflow-hidden shadow-lg"
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