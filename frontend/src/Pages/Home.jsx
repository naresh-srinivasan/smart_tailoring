// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  SparklesIcon,
  CameraIcon,
  Cog6ToothIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import pages from "../Assests/Pages.mp4";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [activeFeature, setActiveFeature] = useState(0);

  // Counter animation for achievements
  const [counters, setCounters] = useState({
    customers: 0,
    orders: 0,
    countries: 0,
    satisfaction: 0,
  });

  const achievements = [
    { number: 5000, suffix: "+", label: "Happy Customers", key: "customers" },
    { number: 15000, suffix: "+", label: "Orders Completed", key: "orders" },
    { number: 25, suffix: "+", label: "Countries Served", key: "countries" },
    { number: 98, suffix: "%", label: "Satisfaction Rate", key: "satisfaction" },
  ];

  const features = [
    {
      icon: ClockIcon,
      title: "100% On-Time Delivery",
      desc: "We ensure your garments reach you exactly when promised, maintaining our commitment to punctuality.",
      highlight: "Never Late Promise",
    },
    {
      icon: UserGroupIcon,
      title: "5000+ Trusted Customers",
      desc: "Our growing family of satisfied clients testament to our exceptional service and quality.",
      highlight: "Growing Community",
    },
    {
      icon: GlobeAltIcon,
      title: "Globally Recognized",
      desc: "Tailoring excellence that transcends borders, trusted by discerning clients worldwide.",
      highlight: "Worldwide Trust",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Transparent Pricing",
      desc: "Premium tailoring at fair prices with no hidden costs - quality that's worth every penny.",
      highlight: "No Hidden Costs",
    },
  ];

  // Smart Features Section
  const smartFeatures = [
    {
      title: "AI-Powered Fitting",
      description: "Revolutionary 3D body scanning technology for perfect measurements every time",
      icon: SparklesIcon,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      benefits: ["99.5% accuracy", "30-second scan", "Perfect fit guarantee"],
    },
    {
      title: "Virtual Try-On",
      description: "See how your custom garments will look before they're made using AR technology",
      icon: CameraIcon,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
      benefits: ["Real-time preview", "Multiple angles", "Color variations"],
    },
    {
      title: "Smart Fabric Selection",
      description: "AI-curated fabric recommendations based on your preferences and lifestyle",
      icon: Cog6ToothIcon,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
      benefits: ["Premium materials", "Weather-appropriate", "Style matching"],
    },
  ];

  // Services Section
  const services = [
    {
      title: "Custom Suits",
      description: "Handcrafted business and formal suits tailored to perfection",
      price: "Starting from ₹15,000",
      features: ["Premium fabrics", "Hand-stitched details", "Perfect fit guarantee"],
    },
    {
      title: "Wedding Collection",
      description: "Make your special day unforgettable with our bridal & groom collections",
      price: "Starting from ₹25,000",
      features: ["Traditional & modern styles", "Intricate embroidery", "Complete ensemble"],
    },
    {
      title: "Casual Wear",
      description: "Comfortable yet stylish everyday clothing for your lifestyle",
      price: "Starting from ₹5,000",
      features: ["Breathable fabrics", "Modern cuts", "Versatile designs"],
    },
    {
      title: "Corporate Uniforms",
      description: "Professional uniforms that represent your brand with distinction",
      price: "Bulk pricing available",
      features: ["Brand customization", "Bulk discounts", "Quality assurance"],
    },
  ];

  // Counter animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      achievements.forEach((achievement) => {
        let start = 0;
        const end = achievement.number;
        const duration = 2000;
        const increment = end / (duration / 50);

        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounters(prev => ({ ...prev, [achievement.key]: end }));
            clearInterval(counter);
          } else {
            setCounters(prev => ({ ...prev, [achievement.key]: Math.floor(start) }));
          }
        }, 50);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleBookNow = () => {
    if (user) {
      navigate("/dashboard/booknow");
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-black text-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover scale-105"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={pages} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80"></div>

        <div className="relative z-10 w-[90vw] max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.p
              className="text-sm md:text-base text-gray-300 uppercase tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The Future of Tailoring
            </motion.p>

            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Weave Nest
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Where artificial intelligence meets artisanal craftsmanship.
              <br />
              Experience the revolution in smart tailoring.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={handleBookNow}
                className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3">
                <PlayIcon className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by thousands worldwide
            </h2>
            <p className="text-gray-400 text-lg">
              Numbers that speak for our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={idx}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counters[achievement.key]}{achievement.suffix}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SMART FEATURES SECTION ===== */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Technology. Perfect Fit.
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Experience the future of tailoring with our cutting-edge technology
            </p>
          </motion.div>

          <div className="space-y-32">
            {smartFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                className={`flex flex-col ${
                  idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-16`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">Innovation</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIdx) => (
                      <div key={benefitIdx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleBookNow}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Learn More
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden bg-white/5 p-8">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-16 h-16 text-white/40" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 text-xl">
              Crafting excellence for every occasion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-white font-semibold mb-4">
                  {service.price}
                </div>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white"
                >
                  Book Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Weave Nest
            </h2>
            <p className="text-gray-400 text-xl">
              Excellence in every thread, innovation in every stitch
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:bg-white/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full mb-4">
                  {feature.highlight}
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to experience the future?
            </h2>
            <p className="text-gray-400 text-xl mb-8 leading-relaxed">
              Join thousands of satisfied customers who have discovered the perfect blend of technology and craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleBookNow}
                className="bg-white text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start Your Journey
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              
              <button className="border border-white/30 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Contact Us
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-6">
              Free consultation • 30-day guarantee • Worldwide shipping
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
