    import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminNotificationForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const token = localStorage.getItem("token"); // Admin token
      const res = await axios.post("/api/notifications", { title, message }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Notification posted successfully!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Error posting notification:", err);
      setSuccess("Failed to post notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#286fad]">Post Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#286fad] text-white px-6 py-2 rounded-lg hover:bg-[#1f5685] transition"
        >
          {loading ? "Posting..." : "Post Notification"}
        </button>
      </form>

      {success && <p className="mt-4 text-green-600 font-medium">{success}</p>}
    </motion.div>
  );
}
