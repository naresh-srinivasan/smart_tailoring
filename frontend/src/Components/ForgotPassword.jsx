// src/Components/ResetPassword.jsx
import React, { useState } from "react";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendResetLink = async () => {
    setMessage("");

    if (!email.trim()) {
      setMessage("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Reset link sent! Check your email.");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text--700 text-center">
        Reset Password
      </h2>

      {message && (
        <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
          {message}
        </div>
      )}

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={handleSendResetLink}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-blue-600 hover:underline font-semibold mt-2"
      >
        Back to Login
      </button>
    </div>
  );
}
