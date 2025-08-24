// src/Pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import pages from "../Assests/Pages.mp4"

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  const features = [
    {
      icon: ClockIcon,
      title: "100% On-Time Delivery",
      desc: "We ensure your garments reach you exactly when promised.",
    },
    {
      icon: UserGroupIcon,
      title: "5000+ Trusted Customers",
      desc: "Our growing family of happy clients keeps coming back for more.",
    },
    {
      icon: GlobeAltIcon,
      title: "Globally Recognized",
      desc: "Tailoring excellence trusted by clients worldwide.",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Affordable & Transparent Pricing",
      desc: "Premium tailoring without breaking the bank.",
    },
  ];

  const handleBookNow = () => {
    if (user) {
      navigate("/dashboard/booknow");
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={pages} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-[90vw] max-w-6xl flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left">
          {/* Left - Title */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center md:items-start"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-5xl md:text-7xl font-extrabold text-white mb-6"
              style={{ fontFamily: "'Dancing Script', cursive", lineHeight: 1 }}
            >
              Weave Nest
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-6 max-w-lg">
              Smart tailoring with premium fabrics, precise craftsmanship, and
              innovative designs. Create garments as unique as you are.
            </p>
            <motion.button
              className="bg-[#286fad] hover:bg-[#1f5685] text-white font-semibold px-10 py-4 rounded-lg shadow-lg text-lg transition duration-300"
              onClick={handleBookNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </motion.div>

          {/* Right - Optional Hero Image */}
          <motion.div
            className="flex-1 hidden md:flex justify-center items-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="w-[90vw] mx-auto mt-24 mb-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-[#d6ba73] hover:bg-[#d6ba73] hover:text-white transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <Icon className="w-12 h-12 mb-4 text-[#286fad]" />
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm">{desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
